<script lang="ts">

import Heading from '../common/Heading.svelte';
</script>

<div class="flex flex-col gap-2">
  <Heading level="2">Categories</Heading>

  <table class="border-3 border-surface-900">
    <thead>
      <tr class="bg-surface-900">
        <th class="px-2 pt-1 pb-1.5 font-normal text-left w-[50%]">Replacement</th>
        <th class="px-2 pt-1 pb-1.5 font-normal text-left w-[50%]">Pattern</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <input type="text" class="" placeholder="test" />
        </td>
        <td>
          <input type="text" class="" placeholder="test" />
        </td>
      </tr>
      <tr>
        <td>
          <input type="text" class="" placeholder="test" />
        </td>
        <td>
          <input type="text" class="" placeholder="test" />
        </td>
      </tr>
    </tbody>
  </table>
</div>