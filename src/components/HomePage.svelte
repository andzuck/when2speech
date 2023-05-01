<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</svelte:head>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossorigin="anonymous">
  import ExistingEvent from './ExistingEvent.svelte';
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

<main>
    <h1>When2Speech</h1>
    <h3>A speech and text based way to find times to meet with others.</h3>
    <br><br><br>
    <a href="/new" class="btn btn-primary btn-lg">Create New Event</a>
    <br><br><br><br>
    <ExistingEvent></ExistingEvent>
</main>

<style>
  .form-element {
    padding: 25px 0px;
  }

  a:visited {
    color: white;
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