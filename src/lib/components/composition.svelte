<script lang="ts">
  import { downloadURL } from '$lib/utils/download';
  import * as htmlToImage from 'html-to-image';
  import Frame from './frame.svelte';

  let compositionRef: HTMLDivElement;

  const saveToImage = () => {
    htmlToImage
      .toPng(compositionRef)
      .then(function (dataUrl) {
        downloadURL(dataUrl, 'framed.png');
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  };
</script>

<div class="composition" bind:this={compositionRef}>
  <Frame />
</div>
<button class="save-button" on:click={saveToImage}>Save</button>

<style>
  .composition {
    aspect-ratio: 4 / 5;
    width: 100%;
    max-width: 400px;
  }

  .save-button {
    height: 30px;
    width: 60px;
  }
</style>
