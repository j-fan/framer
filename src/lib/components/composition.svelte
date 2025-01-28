<script lang="ts">
  import { downloadURL } from '$lib/utils/download';
  import * as htmlToImage from 'html-to-image';
  import Frame from './frame.svelte';

  let compositionRef: HTMLDivElement;
  let loading = false;

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
  <div class="composition" bind:this={compositionRef}>
    <Frame />
  </div>

  <button class="save-button" on:click={saveToImage}>
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
    align-items: start;
  }

  .composition {
    aspect-ratio: 4 / 5;
    width: 100%;
    max-width: 400px;
  }

  .save-button {
    border: 1px solid black;
    border-radius: 1rem;
    padding: 4px 8px;
    cursor: pointer;
    background: transparent;
  }
</style>
