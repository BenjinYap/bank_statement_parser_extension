<script>
  let props = $props();
  
  const COLOR_CLASSES = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-400',
    tertiary: 'bg-tertiary-400',
    error: 'bg-error-400',
  };
  const ENABLED_COLOR_CLASSES = {
    primary: 'hover:bg-primary-600 active:bg-primary-700',
    secondary: 'hover:bg-secondary-500 active:bg-secondary-600',
    tertiary: 'hover:bg-tertiary-500 active:bg-tertiary-600',
    error: 'hover:bg-error-700 active:bg-error-950',
  };
  const ENABLED_CLASSES = 'cursor-pointer';
  const DISABLED_CLASSES = 'opacity-20 cursor-default';

  const final_classes = $derived(`${COLOR_CLASSES[props.color]} ${(props.disabled ? DISABLED_CLASSES : `${ENABLED_CLASSES} ${ENABLED_COLOR_CLASSES[props.color]}`)}`);
  
  const NOT_ICON_CLASSES = 'px-2';
</script>

<button
  class="{props.class} p-1 font-medium text-text-200 rounded-sm {final_classes} {!props.icon ? NOT_ICON_CLASSES : ''}"
  type="button"
  onclick={props.onclick}
  disabled={props.disabled}
>
  {#if props.icon}
    <span
      class="material-symbols-outlined align-top"
    >
      {props.icon}
    </span>
  {:else}
    {props.text}
  {/if}
  
</button>