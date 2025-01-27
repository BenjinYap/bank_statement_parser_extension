<script>
  let props = $props();
  
  const COLOR_CLASSES = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    accent: 'bg-accent-600',
  };
  const ENABLED_COLOR_CLASSES = {
    primary: 'hover:bg-primary-700 active:bg-primary-500',
    secondary: 'hover:bg-secondary-700 active:bg-secondary-500',
    accent: 'hover:bg-accent-700 active:bg-accent-500',
  };
  const ENABLED_CLASSES = 'cursor-pointer';
  const DISABLED_CLASSES = 'opacity-20 cursor-default';

  const final_classes = `${COLOR_CLASSES[props.color]} ${(props.disabled ? DISABLED_CLASSES : `${ENABLED_CLASSES} ${ENABLED_COLOR_CLASSES[props.color]}`)}`;
</script>

<button
  class="{props.class} p-1 font-medium text-text-50 rounded-sm {final_classes}"
  type="button"
  onclick={props.onclick}
  disabled={props.disabled}
>
  {#if props.icon}
    <span
      class="material-symbols-outlined align-middle"
    >
      {props.icon}
    </span>
  {:else}
    {props.text}
  {/if}
  
</button>