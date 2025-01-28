<script lang="ts">
  import { downloadURL } from '$lib/utils/download';
  import * as htmlToImage from 'html-to-image';

  let frameRef: HTMLDivElement;

  const saveToImage = () => {
    htmlToImage
      .toPng(frameRef)
      .then(function (dataUrl) {
        downloadURL(dataUrl, 'framed.png');
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  };
</script>

<div class="frame" bind:this={frameRef}>
  <img src="/img/rose.png" alt="rose" />
  <div class="overlay"></div>
</div>
<button class="save-button" on:click={saveToImage}>Save</button>

<style>
  .frame {
    aspect-ratio: 4 / 5;
    width: 400px;
    position: relative;
    border-radius: 1rem;
    border: 1px solid black;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .save-button {
    height: 30px;
    width: 60px;
  }
</style>
