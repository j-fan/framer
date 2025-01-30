<script lang="ts">
  import { downloadURL } from '$lib/utils/download';
  import * as htmlToImage from 'html-to-image';
  import Frame from './frame.svelte';

  type CompositionLayout = 'portrait' | 'double-landscape' | 'single-landscape' | 'square';

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
      // Strange workaround from iOS Safari https://github.com/bubkoo/html-to-image/issues/361
      await htmlToImage.toPng(compositionRef);
      await htmlToImage.toPng(compositionRef);
      await htmlToImage.toPng(compositionRef);

      const result = await htmlToImage.toPng(compositionRef);
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
      class:selected-button={layout === 'single-landscape'}
      on:click={() => {
        layout = 'single-landscape';
      }}
    >
      Single landscape
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
  <div class="composition" bind:this={compositionRef}>
    {#if layout === 'portrait'}
      <Frame aspectRatio="4 / 5" />
    {:else if layout === 'single-landscape'}
      <Frame aspectRatio="4 / 3" />
    {:else if layout === 'double-landscape'}
      <Frame aspectRatio="5 / 3" />
      <Frame aspectRatio="5 / 3" />
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
    padding: 1rem;
    width: 100%;
    min-height: 100%;
  }

  .composition {
    width: 100%;
    aspect-ratio: 4 / 5;
    padding: 0.5rem;
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
