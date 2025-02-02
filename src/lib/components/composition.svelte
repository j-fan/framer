<script lang="ts">
  import { downloadURL } from '$lib/utils/download';
  import Frame from './frame.svelte';
  import { domToPng } from 'modern-screenshot';

  type CompositionLayout =
    | 'portrait'
    | 'portrait-no-padding'
    | 'double-landscape'
    | 'single-landscape32'
    | 'single-landscape169'
    | 'square';

  let compositionRef: HTMLDivElement;
  let loading = false;
  let layout: CompositionLayout = 'portrait';

  const saveToImage = async () => {
    loading = true;
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach((b) => {
      (b as HTMLButtonElement).style.display = 'none';
    });

    try {
      const result = await domToPng(compositionRef, { scale: 4, quality: 0.9 });
      downloadURL(result, 'framed');
    } catch (error) {
      console.error('oops, something went wrong!', error);
    } finally {
      removeButtons.forEach((b) => {
        (b as HTMLButtonElement).style.display = 'block';
      });
      loading = false;
    }
  };
</script>

<div class="wrapper">
  <div class="button-container">
    <button
      class="button"
      class:selected-button={layout === 'portrait'}
      on:click={() => {
        layout = 'portrait';
      }}
    >
      Portrait
    </button>
    <button
      class="button"
      class:selected-button={layout === 'portrait-no-padding'}
      on:click={() => {
        layout = 'portrait-no-padding';
      }}
    >
      Portrait - no padding
    </button>
    <button
      class="button"
      class:selected-button={layout === 'single-landscape32'}
      on:click={() => {
        layout = 'single-landscape32';
      }}
    >
      Landscape 3:2
    </button>
    <button
      class="button"
      class:selected-button={layout === 'single-landscape169'}
      on:click={() => {
        layout = 'single-landscape169';
      }}
    >
      Landscape 6:9
    </button>
    <button
      class="button"
      class:selected-button={layout === 'double-landscape'}
      on:click={() => {
        layout = 'double-landscape';
      }}
    >
      Double landscape
    </button>
    <button
      class="button"
      class:selected-button={layout === 'square'}
      on:click={() => {
        layout = 'square';
      }}
    >
      Square
    </button>
  </div>
  <div
    class="composition"
    bind:this={compositionRef}
    class:has-padding={layout !== 'portrait-no-padding'}
  >
    {#if layout === 'portrait'}
      <Frame aspectRatio="4 / 5" />
    {:else if layout === 'portrait-no-padding'}
      <Frame aspectRatio="4 / 5" isRounded={false} />
    {:else if layout === 'single-landscape32'}
      <Frame aspectRatio="3 / 2" />
    {:else if layout === 'single-landscape169'}
      <Frame aspectRatio="16 / 9" />
    {:else if layout === 'double-landscape'}
      <Frame />
      <Frame />
    {:else if layout === 'square'}
      <Frame aspectRatio="1" />
    {/if}
  </div>

  <button class="button" on:click={saveToImage}>
    {#if loading}
      Saving...
    {:else}
      Save composition
    {/if}
  </button>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    background-color: lightgrey;
    width: 100%;
    min-height: 100%;
    padding: 1rem;
  }

  .has-padding {
    padding: 0.5rem;
  }

  .composition {
    width: 100%;
    aspect-ratio: 4 / 5;
    gap: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: white;
  }

  .button {
    border: 1px solid black;
    border-radius: 1rem;
    padding: 4px 8px;
    cursor: pointer;
    background: transparent;
    color: black;
  }

  .selected-button {
    background-color: lightgreen;
  }

  .button-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
</style>
