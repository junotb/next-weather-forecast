/**
 * 에러 메시지를 사용자 친화적으로 변환
 * @see docs/ROADMAP_DECISIONS.md - 4. 에러 메시지
 */
export function toUserFriendlyMessage(error: Error): string {
  const msg = (error.message || '').toLowerCase();

  if (/network|failed to fetch|connection refused|econnrefused|enotfound/i.test(msg)) {
    return '인터넷 연결을 확인해주세요.';
  }
  if (/timeout|etimedout|timed out/i.test(msg)) {
    return '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
  }
  if (/5\d{2}|internal server error|server error/i.test(msg)) {
    return '잠시 후 다시 시도해주세요.';
  }
  if (/4\d{2}|unauthorized|forbidden|invalid.*key|인증|auth/i.test(msg)) {
    return '서비스 이용에 문제가 있습니다.';
  }
  if (/api|호출 실패|data.go.kr/i.test(msg)) {
    return '날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
  }

  return '예기치 않은 오류가 발생했습니다. 다시 시도해주세요.';
}
