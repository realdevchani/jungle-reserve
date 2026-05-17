/**
 * 이름 마스킹
 * 허준 → 허*
 * 홍길동 → 홍*동
 * 황보도윤 → 황**윤
 */
export const maskName = (name) => {
  if (!name) return "—";
  const len = name.length;
  if (len <= 1) return name;
  if (len === 2) return name[0] + "*";
  return name[0] + "*".repeat(len - 2) + name[len - 1];
};

/**
 * 전화번호 마스킹
 * 010-1234-5678 → 010-12**-**78
 */
export const maskPhone = (phone) => {
  if (!phone) return "—";
  const parts = phone.split("-");
  if (parts.length === 3) {
    const p2 = parts[1].slice(0, 2) + "*".repeat(parts[1].length - 2);
    const p3 = "*".repeat(parts[2].length - 2) + parts[2].slice(-2);
    return `${parts[0]}-${p2}-${p3}`;
  }
  return phone;
};
