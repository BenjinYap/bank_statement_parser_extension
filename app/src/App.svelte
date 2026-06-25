<script lang="ts">
  import { mock } from './mock'

  let dom: string | undefined = $state(undefined)

  ;(async () => {
    const dev_mode = !chrome.runtime

    await new Promise<void>((resolve) => {
      if (!dev_mode) {
        // running in real extension mode
        chrome.runtime.onMessage.addListener((req) => {
          if (req.action === 'tab_opened') {
            dom = req.html
            resolve()
          }
        })
      } else {
        // local dev mode
        setTimeout(() => {
          dom = mock
          resolve()
        }, 100)
      }
    })
  })()
</script>

<div class="flex flex-col items-stretch gap-2 py-2 max-w-[1000px] w-full">
  <textarea
    readonly
    class="w-full h-[600px] font-mono text-xs p-2 border border-gray-300"
    value={dom ?? ''}
  ></textarea>
</div>
