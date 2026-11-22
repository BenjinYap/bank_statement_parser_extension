<script lang="ts">
  import { CropperCanvas, CropperHandle, ACTION_RESIZE_NORTH, ACTION_RESIZE_SOUTH } from 'cropperjs';
  import type { VerticalCrop } from './shrinkPhoto';
  import CropHandle from './CropHandle.svelte';

  // The touch target of each handle has this height too, so the two targets cannot overlap.
  const MIN_CROP_HEIGHT_PX = 48;

  // The import does not register the custom elements.
  CropperCanvas.$define();
  CropperHandle.$define();

  type CropperActionEvent = CustomEvent<{ action:string; startY:number; endY:number }> & { currentTarget:HTMLElement };

  interface Props {
    photo:File;
    crop:VerticalCrop;
    oncrop:(crop:VerticalCrop) => void;
  }

  let props:Props = $props();

  let photoUrl:string|undefined = $state(undefined);
  // The position of the dragged edge without limits. It keeps the edge below the finger after a drag past a limit.
  let draggedY:number = 0;

  $effect(() => {
    const url:string = URL.createObjectURL(props.photo);
    photoUrl = url;

    return () => URL.revokeObjectURL(url);
  });

  function startDrag(event:CropperActionEvent) {
    let edge:number = props.crop.bottom;
    if (event.detail.action === ACTION_RESIZE_NORTH) {
      edge = props.crop.top;
    }

    draggedY = edge * event.currentTarget.clientHeight;
  }

  // Cropper.js selections reject a move past a limit and do not clamp it, so this function sets the edges.
  function drag(event:CropperActionEvent) {
    const action:string = event.detail.action;
    if (action !== ACTION_RESIZE_NORTH && action !== ACTION_RESIZE_SOUTH) {
      return;
    }

    const height:number = event.currentTarget.clientHeight;
    if (height <= MIN_CROP_HEIGHT_PX) {
      return;
    }

    // Cropper.js reports the movement since the previous event.
    draggedY += event.detail.endY - event.detail.startY;
    const position:number = draggedY / height;
    const gap:number = MIN_CROP_HEIGHT_PX / height;
    const top:number = props.crop.top;
    const bottom:number = props.crop.bottom;
    if (action === ACTION_RESIZE_NORTH) {
      const maxTop:number = bottom - gap;
      props.oncrop({ top: Math.min(Math.max(position, 0), maxTop), bottom });
      return;
    }

    const minBottom:number = top + gap;
    props.oncrop({ top, bottom: Math.min(Math.max(position, minBottom), 1) });
  }
</script>

<!-- Half of each handle is outside the photo, so the margin keeps the handles off the other elements. -->
<div class="relative w-full my-6">
  <img
    src={photoUrl}
    alt="Receipt to crop"
    class="block w-full"
  />
  <!-- A drag on the photo scrolls the page. A drag on a handle moves the edge. -->
  <cropper-canvas
    class="absolute inset-0 min-w-0 min-h-0 overflow-visible touch-pan-y"
    onactionstart={startDrag}
    onaction={drag}
  >
    <div
      class="absolute inset-x-0 top-0 border-b-2 border-primary-600 bg-black/70 pointer-events-none"
      style:height="{props.crop.top * 100}%"
    ></div>
    <div
      class="absolute inset-x-0 bottom-0 border-t-2 border-primary-600 bg-black/70 pointer-events-none"
      style:height="{(1 - props.crop.bottom) * 100}%"
    ></div>
    <CropHandle
      action={ACTION_RESIZE_NORTH}
      position={props.crop.top}
    />
    <CropHandle
      action={ACTION_RESIZE_SOUTH}
      position={props.crop.bottom}
    />
  </cropper-canvas>
</div>
