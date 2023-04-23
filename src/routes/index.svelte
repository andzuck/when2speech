<script>
  import { Router, Route } from 'svelte-routing';
  import InputTimes from '../components/InputTimes.svelte';
  import NewEvent from '../components/NewEvent.svelte';

  export let url = '';
</script>

<Router {url}>
  <div>
    <Route path="input" component={InputTimes} />
    <Route path="/" component={NewEvent} />
  </div>
</Router>