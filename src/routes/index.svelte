<script>
  import { Router, Route } from 'svelte-routing';
  import InputTimes from '../components/InputTimes.svelte';
  import NewEvent from '../components/NewEvent.svelte';
  import HomePage from '../components/HomePage.svelte';
  import ExistingEvent from '../components/ExistingEvent.svelte';

  export let url = '';
</script>



<Router {url}>
  <div>
    <!-- <Route path="/event" component={InputTimes} /> -->
    <Route path="/new" component={NewEvent} />
    <Route path="/" component={HomePage} />

    <Route path="/:id" let:params>
      <InputTimes eventID={params.id}></InputTimes>
    </Route>

  </div>
</Router>