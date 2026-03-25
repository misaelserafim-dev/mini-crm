export const maskNumber = (value: string) => {
  if (!value) return "";
  
  const digits = value.replace(/\D/g, "");

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

export const cleanNumber = (value: string) => {
  return value.replace(/\D/g, "");
};