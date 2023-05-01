<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</svelte:head>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossorigin="anonymous">
  let eventcode = '';

  function onClick() {
    console.log('hay');
    location.href = "/" + eventcode;
  };

</script>
<head>
  <script
    type="module"
    src="https://cdn.jsdelivr.net/npm/inclusive-dates/dist/esm/inclusive-dates.js"
  />

  <!-- Loading the theme is optional. -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/inclusive-dates/dist/themes/light.css"
  />
</head>

<div>
    <div class="cf">
    <div class="existing-event" role="region">
      <label for="event-code"><h3>Enter Existing Event Code</h3></label>
      <br>
      <input id="event-code" bind:value={eventcode}>
      <br>
      <br>
    </div>
  </div>
    <button on:click={onClick} type="button" class="btn btn-primary btn-lg">Enter Event</button>
</div>

<style>
  .form-element {
    padding: 25px 0px;
  }

  :global(.inclusive-dates__input-container) {
    margin: auto;
  }

  :global(.inclusive-dates__label) {
    visibility: hidden;
    height: 0px;
    margin: 0px
  }
</style>