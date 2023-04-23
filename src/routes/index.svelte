<script>
  import { Router, Route } from 'svelte-routing';
  import InputTimes from '../components/InputTimes.svelte';
  import NewEvent from '../components/NewEvent.svelte';
  import HomePage from '../components/HomePage.svelte';

  export let url = '';
</script>



<Router {url}>
  <div>
    <Route path="input" component={InputTimes} />
    <Route path="new" component={NewEvent} />
    <Route path="/" component={HomePage} />
  </div>
</Router>