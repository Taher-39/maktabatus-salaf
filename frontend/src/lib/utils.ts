export function formatPrice(price: number): string {
  return `৳${price.toLocaleString("bn-BD")}`;
}

export function getAuthorName(author: { name: string } | string): string {
  return typeof author === "string" ? "" : author.name;
}

export function getCategoryName(category: { name: string } | string): string {
  return typeof category === "string" ? "" : category.name;
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
