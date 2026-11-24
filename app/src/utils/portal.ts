// Moves the node to the end of the body.
// Then the stacking context of an ancestor cannot put the node under other content.
export function portal(node:HTMLElement):{ destroy:() => void } {
  document.body.appendChild(node);

  return {
    destroy() {
      node.remove();
    },
  };
}
