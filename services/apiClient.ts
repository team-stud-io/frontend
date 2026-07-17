export type ApiErrorKind =
  | 'network'
  | 'validation'
  | 'notFound'
  | 'conflict'
  | 'server'
  | 'unknown';

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly field?: string;
  readonly kind: ApiErrorKind;

  constructor(message: string, options: { status?: number; code?: string; field?: string } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? 0;
    this.code = options.code;
    this.field = options.field;
    this.kind = getApiErrorKind(this.status);
  }
}

export function getApiErrorKind(status: number): ApiErrorKind {
  if (status === 0) return 'network';
  if (status === 400 || status === 413 || status === 415) return 'validation';
  if (status === 404) return 'notFound';
  if (status === 409) return 'conflict';
  if (status >= 500) return 'server';
  return 'unknown';
}

export function getApiErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  switch (error.kind) {
    case 'network': return '백엔드 서버에 연결할 수 없습니다. 서버 주소와 실행 상태를 확인해 주세요.';
    case 'validation': return error.message || '입력값을 확인해 주세요.';
    case 'notFound': return '요청한 세션 또는 과목을 찾을 수 없습니다.';
    case 'conflict': return error.message || '이미 처리된 요청이거나 중복된 항목입니다.';
    case 'server': return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    default: return error.message || '요청을 처리하지 못했습니다.';
  }
}

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

export function isBackendConfigured() {
  return Boolean(baseUrl);
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!baseUrl) {
    throw new ApiError('EXPO_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (options.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new ApiError('네트워크 연결에 실패했습니다.');
  }

  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get('content-type') ?? '';
  const payload: unknown = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  const envelope = payload as {
    success?: boolean;
    data?: T;
    error?: { code?: string; message?: string; field?: string };
    code?: string;
    message?: string;
    field?: string;
  } | null;

  if (!response.ok || envelope?.success === false) {
    throw new ApiError(envelope?.error?.message ?? envelope?.message ?? `요청에 실패했습니다. (${response.status})`, {
      status: response.status,
      code: envelope?.error?.code ?? envelope?.code,
      field: envelope?.error?.field ?? envelope?.field,
    });
  }

  return envelope && typeof envelope === 'object' && 'data' in envelope
    ? envelope.data as T
    : payload as T;
}
