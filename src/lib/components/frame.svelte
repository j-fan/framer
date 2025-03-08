<script lang="ts">
  import { onMount } from 'svelte';
  import Interact from 'interactjs';
  import reduce from 'image-blob-reduce';

  /**
   * If no aspect ratio, the frame
   * will grow to fit the composition
   */
  export let aspectRatio = '';
  export let isRounded = true;
  export let onImageChange: (imgSrc: string) => void;

  let imgSrc = '';
  let files: FileList | undefined = undefined;

  let frameRef: HTMLDivElement;
  let bgPercentX = 50;
  let bgPercentY = 50;
  let zoomLevel = 100;
  let isResizing = false;

  $: hasFile = files && files.length;

  // This effect is called upon image upload
  // It sets the uploaded image as the new image
  $: {
    if (files && files.length) {
      resizeAndAssignImgSrc(files);
    }
  }

  const dragMoveListener = (event: Interact.DragEvent) => {
    bgPercentX = bgPercentX - event.dx;
    bgPercentY = bgPercentY - event.dy;
  };

  const resizeAndAssignImgSrc = async (files: FileList) => {
    isResizing = true;
    const file = files[0];
    const reduced = await reduce().toBlob(file, { max: 2000 });
    imgSrc = URL.createObjectURL(reduced);
    onImageChange(imgSrc);
    isResizing = false;
  };

  onMount(() => {
    Interact(frameRef)
      .gesturable({
        listeners: {
          move(event) {
            zoomLevel = event.scale * 100;
            dragMoveListener(event);
          }
        }
      })
      .draggable({
        listeners: { move: dragMoveListener }
      });

    return () => {};
  });

  const removeFile = () => {
    URL.revokeObjectURL(imgSrc);
    imgSrc = '';
    files = undefined;
    bgPercentX = 0;
    bgPercentY = 0;
    zoomLevel = 100;
    onImageChange('');
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={frameRef}
  class="frame"
  class:has-border={!hasFile}
  class:is-rounded={isRounded}
  style="background-image: url({imgSrc}); aspect-ratio: {aspectRatio}; background-position: {bgPercentX}% {bgPercentY}%; background-size: {zoomLevel}%; flex-grow:{aspectRatio
    ? 0
    : 1};"
>
  <div class="overlay">
    {#if isResizing}
      <p>Resizing...</p>
    {:else if hasFile}
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
    overflow: hidden;
    background-size: 100%;
    background-repeat: no-repeat;
    width: 100%;
  }

  .is-rounded {
    border-radius: 1rem;
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
