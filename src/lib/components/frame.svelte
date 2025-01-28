<script lang="ts">
  export let aspectRatio = '4 / 5';

  let imgSrc = '';
  let files: FileList | undefined = undefined;

  let frameWidth = 1;
  let isDragging = false;
  let startPosX = 0;
  let startPosY = 0;
  let posX = 0;
  let posY = 0;
  $: movePercentX = (100 * (startPosX - posX)) / 100; // TODO Replace 100 with frameWidth after fixing the calculation
  $: movePercentY = (100 * (startPosY - posY)) / 100;

  $: hasFile = files && files.length;

  // This effect is called upon image upload
  // It sets the uploaded image as the new image
  $: {
    if (files && files.length) {
      // Temporary image variable used to measure dimensions
      const tempImage = new Image();

      imgSrc = URL.createObjectURL(files[0]);

      tempImage.src = imgSrc;
      tempImage.onload = () => {
        frameWidth = tempImage.width;
      };
    }
  }

  const removeFile = () => {
    URL.revokeObjectURL(imgSrc);
    imgSrc = '';
    files = undefined;
  };

  const handleMouseStart = (e: MouseEvent) => {
    e.preventDefault();
    startPosX = e.pageX;
    startPosY = e.pageY;
    isDragging = true;
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    startPosX = e.touches[0].pageX;
    startPosY = e.touches[0].pageY;
    isDragging = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!isDragging) {
      return;
    }
    posX = e.pageX;
    posY = e.pageY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (!isDragging) {
      return;
    }
    posX = e.touches[0].pageX;
    posY = e.touches[0].pageY;
  };

  const handleMoveEnd = () => {
    isDragging = false;
  };
</script>

<!-- <div>{movePercentX} {movePercentY}</div> -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="frame"
  class:has-border={!hasFile}
  style="background-image: url({imgSrc}); aspect-ratio: {aspectRatio}; background-position: {movePercentX}% {movePercentY}%;"
  on:mousedown={handleMouseStart}
  on:touchstart={handleTouchStart}
  on:mousemove={handleMouseMove}
  on:touchmove={handleTouchMove}
  on:mouseup={handleMoveEnd}
  on:touchend={handleMoveEnd}
>
  <div class="overlay">
    {#if hasFile}
      <button class="remove-button" type="button" on:click={removeFile}>X</button>
    {:else}
      <label for="file-upload" class="custom-file-input">Upload image</label>
      <input
        id="file-upload"
        bind:files
        type="file"
        accept="image/png, image/jpeg"
        class="file-input"
      />
    {/if}
  </div>
</div>

<style>
  .frame {
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
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
  }

  .remove-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
</style>
