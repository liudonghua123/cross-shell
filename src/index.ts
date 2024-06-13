const world = "world";

/**
 * say hello to someone
 *
 * @param who - the person you want to say hello
 * @returns the message to say hello
 */
export function hello(who: string = world): string {
  return `Hello ${who}!`;
}
