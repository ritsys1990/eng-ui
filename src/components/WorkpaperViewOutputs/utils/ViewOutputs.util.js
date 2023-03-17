export function mapOutputsToView(outputs) {
  if (!outputs || !outputs.length) {
    return [];
  }

  return outputs
    .map(output => ({
      ...output,
      workpapers: output.workpapers
        .filter(wp => wp.executionCompleted)
        .filter(wp => wp.outputs.length || wp.tableau_outputs.length),
    }))
    .filter(output => output.workpapers.length);
}
