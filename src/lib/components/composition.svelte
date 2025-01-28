<script lang="ts">
  import { downloadURL } from '$lib/utils/download';
  import * as htmlToImage from 'html-to-image';
  import Frame from './frame.svelte';

  type CompositionLayout = 'portrait' | 'double-landscape' | 'single-landscape' | 'square';

  let compositionRef: HTMLDivElement;
  let loading = false;
  let layout: CompositionLayout = 'portrait';

  const saveToImage = () => {
    loading = true;
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach((b) => {
      (b as HTMLButtonElement).style.display = 'none';
    });

    htmlToImage
      .toPng(compositionRef)
      .then(function (dataUrl) {
        downloadURL(dataUrl, 'framed.png');
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      })
      .finally(() => {
        removeButtons.forEach((b) => {
          (b as HTMLButtonElement).style.display = 'block';
        });
        loading = false;
      });
  };
</script>

<div class="wrapper">
  <div>
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
      <Frame aspectRatio="16 / 9" />
      <Frame aspectRatio="16 / 9" />
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
    padding-block: 2rem;
  }

  .composition {
    aspect-ratio: 4 / 5;
    height: 100vh;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: white;
  }

  .button {
    border: 1px solid black;
    border-radius: 1rem;
    padding: 4px 8px;
    cursor: pointer;
    background: transparent;
  }

  .selected-button {
    background-color: lightgreen;
  }
</style>
