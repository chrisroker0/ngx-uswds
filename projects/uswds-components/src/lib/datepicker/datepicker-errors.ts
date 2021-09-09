
/** @docs-private */
export function createMissingDateImplError(provider: string) {
  return Error(
    `UsaDatepicker: No provider found for ${provider}. You must import one of the following ` +
    `modules at your application root: UsaNativeDateModule, UsaMomentDateModule, or provide a ` +
    `custom implementation.`);
}
