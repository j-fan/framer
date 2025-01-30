<script lang="ts">
  import Gesto from 'gesto';
  import { onMount } from 'svelte';

  /**
   * If no aspect ratio, the frame
   * will grow to fit the composition
   */
  export let aspectRatio = '';

  let imgSrc = '';
  let files: FileList | undefined = undefined;

  let frameRef: HTMLDivElement;
  let elePosX = 0;
  let elePosY = 0;
  let bgPercentX = 0;
  let bgPercentY = 0;
  let zoomLevel = 100;

  $: hasFile = files && files.length;

  // This effect is called upon image upload
  // It sets the uploaded image as the new image
  $: {
    if (files && files.length) {
      imgSrc = URL.createObjectURL(files[0]);
    }
  }

  onMount(() => {
    const gesto = new Gesto(frameRef, {
      container: window,
      pinchOutside: true,
      pinchThreshold: 0
    })
      .on('pinch', (e) => {
        zoomLevel = e.scale * 100;
      })
      .on('dragStart', (e) => {
        elePosX = bgPercentX;
        elePosY = bgPercentY;
      })
      .on('drag', (e) => {
        bgPercentX = elePosX - e.distX;
        bgPercentY = elePosY - e.distY;
      });

    return () => {
      gesto.unset();
    };
  });

  const removeFile = () => {
    URL.revokeObjectURL(imgSrc);
    imgSrc = '';
    files = undefined;
    elePosX = 0;
    elePosY = 0;
    bgPercentX = 0;
    bgPercentY = 0;
    zoomLevel = 100;
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={frameRef}
  class="frame"
  class:has-border={!hasFile}
  style="background-image: url({imgSrc}); aspect-ratio: {aspectRatio}; background-position: {bgPercentX}% {bgPercentY}%; background-size: {zoomLevel}%; flex-grow:{aspectRatio
    ? 0
    : 1};"
>
  <div class="overlay">
    {#if hasFile}
      <button class="remove-button" type="button" on:click={removeFile}>X</button>
    {:else}
      <label for="file-upload" class="custom-file-input">Upload image</label>
      <input id="file-upload" bind:files type="file" accept="image/*" class="file-input" />
    {/if}
  </div>
</div>

<style>
  .frame {
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    background-size: 100%;
    background-repeat: no-repeat;
    width: 100%;
  }

  .has-border {
    border: 1px dashed black;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .file-input {
    display: none;
  }

  .custom-file-input,
  .remove-button {
    border: 1px solid black;
    border-radius: 1rem;
    padding: 4px 8px;
    cursor: pointer;
    background: transparent;
    min-width: 34px;
    color: black;
  }

  .remove-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
</style>
