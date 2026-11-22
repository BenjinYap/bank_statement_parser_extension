<script lang="ts">
  interface Props {
    // The Cropper.js action of a drag on this handle.
    action:string;
    // The ratio from 0 to 1 of the photo height.
    position:number;
  }

  let props:Props = $props();
</script>

<cropper-handle
  action={props.action}
  class="crop-handle"
  style:top="{props.position * 100}%"
></cropper-handle>

<style>
  /* These styles replace the 15 px touch target and the 5 px dot of Cropper.js. Keep the height equal to MIN_CROP_HEIGHT_PX. */
  .crop-handle {
    bottom: auto;
    height: 48px;
    touch-action: none;
    transform: translate(-50%, -50%);
  }

  .crop-handle::after {
    width: 48px;
    height: 8px;
    border-radius: 4px;
    background-color: var(--color-amber-600);
  }
</style>
