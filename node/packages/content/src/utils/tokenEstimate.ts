export function estimateTokenCount(text: string): number {
    // Approximation: 1 token ~ 4 characters
    return Math.ceil(text.length / 4);
  }
  