
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    // Adapted from https://github.com/then/is-promise/blob/master/index.js
    // Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE
    function is_promise(value) {
        return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.55.1 */

    function create_fragment$a(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.55.1 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Recorder.svelte generated by Svelte v3.55.1 */
    const file$7 = "src/components/Recorder.svelte";

    // (32:4) {#if isActive}
    function create_if_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Recording...";
    			add_location(p, file$7, 32, 6, 1018);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(32:4) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let button0;
    	let t0_value = (/*isActive*/ ctx[0] ? 'Pause' : 'Record') + "";
    	let t0;
    	let t1;
    	let button1;
    	let t3;
    	let mounted;
    	let dispose;
    	let if_block = /*isActive*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "RESET";
    			t3 = space();
    			if (if_block) if_block.c();
    			attr_dev(button0, "border", "2px solid black");
    			attr_dev(button0, "background-color", "orange");
    			add_location(button0, file$7, 28, 4, 718);
    			add_location(button1, file$7, 29, 4, 859);
    			add_location(div, file$7, 27, 0, 708);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, t0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(div, t3);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isActive*/ 1 && t0_value !== (t0_value = (/*isActive*/ ctx[0] ? 'Pause' : 'Record') + "")) set_data_dev(t0, t0_value);

    			if (/*isActive*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Recorder', slots, []);
    	const dispatch = createEventDispatcher();
    	let isActive = false;

    	function playHandler() {
    		$$invalidate(0, isActive = !isActive);
    	}

    	function iconHandler(type) {
    		if (type === "PLAY" || type === "PAUSE") {
    			$$invalidate(0, isActive = !isActive);
    		}

    		let actionType = type === "PLAY" && isActive
    		? "PLAY"
    		: type === "PLAY" && !isActive ? "PAUSE" : type;

    		// console.log(actionType);
    		dispatch("recorderHandler", { actionType });
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Recorder> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => iconHandler('PLAY');
    	const click_handler_1 = () => iconHandler('RESET');

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		isActive,
    		playHandler,
    		iconHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ('isActive' in $$props) $$invalidate(0, isActive = $$props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isActive, iconHandler, click_handler, click_handler_1];
    }

    class Recorder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Recorder",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    var dist = {};

    var en = {};

    var ENTimeUnitWithinFormatParser = {};

    var constants$9 = {};

    var pattern = {};

    Object.defineProperty(pattern, "__esModule", { value: true });
    pattern.matchAnyPattern = pattern.extractTerms = pattern.repeatedTimeunitPattern = void 0;
    function repeatedTimeunitPattern(prefix, singleTimeunitPattern) {
        const singleTimeunitPatternNoCapture = singleTimeunitPattern.replace(/\((?!\?)/g, "(?:");
        return `${prefix}${singleTimeunitPatternNoCapture}\\s{0,5}(?:,?\\s{0,5}${singleTimeunitPatternNoCapture}){0,10}`;
    }
    pattern.repeatedTimeunitPattern = repeatedTimeunitPattern;
    function extractTerms(dictionary) {
        let keys;
        if (dictionary instanceof Array) {
            keys = [...dictionary];
        }
        else if (dictionary instanceof Map) {
            keys = Array.from(dictionary.keys());
        }
        else {
            keys = Object.keys(dictionary);
        }
        return keys;
    }
    pattern.extractTerms = extractTerms;
    function matchAnyPattern(dictionary) {
        const joinedTerms = extractTerms(dictionary)
            .sort((a, b) => b.length - a.length)
            .join("|")
            .replace(/\./g, "\\.");
        return `(?:${joinedTerms})`;
    }
    pattern.matchAnyPattern = matchAnyPattern;

    var years = {};

    var dayjs_minExports = {};
    var dayjs_min = {
      get exports(){ return dayjs_minExports; },
      set exports(v){ dayjs_minExports = v; },
    };

    (function (module, exports) {
    	!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return "["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else {var a=e.name;D[a]=e,i=a;}return !r&&i&&(g=i),i||!r&&g},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=v;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===l)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),l=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(h){case c:return r?l(1,0):l(31,11);case f:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),l=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,l=this;r=Number(r);var $=O.p(h),y=function(t){var e=w(l);return O.w(e.date(e.date()+Math.round(t*r)),l)};if($===f)return this.set(f,this.$M+r);if($===c)return this.set(c,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},$={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||$[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,v=this-M,g=O.m(this,M);return g=($={},$[c]=g/12,$[f]=g,$[h]=g/3,$[o]=(v-m)/6048e5,$[a]=(v-m)/864e5,$[u]=v/n,$[s]=v/e,$[i]=v/t,$)[y]||v,l?g:O.a(g)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),T=_.prototype;return w.prototype=T,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){T[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[g],w.Ls=D,w.p={},w}));
    } (dayjs_min));

    var __importDefault$n = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(years, "__esModule", { value: true });
    years.findYearClosestToRef = years.findMostLikelyADYear = void 0;
    const dayjs_1$d = __importDefault$n(dayjs_minExports);
    function findMostLikelyADYear(yearNumber) {
        if (yearNumber < 100) {
            if (yearNumber > 50) {
                yearNumber = yearNumber + 1900;
            }
            else {
                yearNumber = yearNumber + 2000;
            }
        }
        return yearNumber;
    }
    years.findMostLikelyADYear = findMostLikelyADYear;
    function findYearClosestToRef(refDate, day, month) {
        const refMoment = dayjs_1$d.default(refDate);
        let dateMoment = refMoment;
        dateMoment = dateMoment.month(month - 1);
        dateMoment = dateMoment.date(day);
        dateMoment = dateMoment.year(refMoment.year());
        const nextYear = dateMoment.add(1, "y");
        const lastYear = dateMoment.add(-1, "y");
        if (Math.abs(nextYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
            dateMoment = nextYear;
        }
        else if (Math.abs(lastYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
            dateMoment = lastYear;
        }
        return dateMoment.year();
    }
    years.findYearClosestToRef = findYearClosestToRef;

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.FULL_MONTH_NAME_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
    	const pattern_1 = pattern;
    	const years_1 = years;
    	exports.WEEKDAY_DICTIONARY = {
    	    sunday: 0,
    	    sun: 0,
    	    "sun.": 0,
    	    monday: 1,
    	    mon: 1,
    	    "mon.": 1,
    	    tuesday: 2,
    	    tue: 2,
    	    "tue.": 2,
    	    wednesday: 3,
    	    wed: 3,
    	    "wed.": 3,
    	    thursday: 4,
    	    thurs: 4,
    	    "thurs.": 4,
    	    thur: 4,
    	    "thur.": 4,
    	    thu: 4,
    	    "thu.": 4,
    	    friday: 5,
    	    fri: 5,
    	    "fri.": 5,
    	    saturday: 6,
    	    sat: 6,
    	    "sat.": 6,
    	};
    	exports.FULL_MONTH_NAME_DICTIONARY = {
    	    january: 1,
    	    february: 2,
    	    march: 3,
    	    april: 4,
    	    may: 5,
    	    june: 6,
    	    july: 7,
    	    august: 8,
    	    september: 9,
    	    october: 10,
    	    november: 11,
    	    december: 12,
    	};
    	exports.MONTH_DICTIONARY = Object.assign(Object.assign({}, exports.FULL_MONTH_NAME_DICTIONARY), { jan: 1, "jan.": 1, feb: 2, "feb.": 2, mar: 3, "mar.": 3, apr: 4, "apr.": 4, jun: 6, "jun.": 6, jul: 7, "jul.": 7, aug: 8, "aug.": 8, sep: 9, "sep.": 9, sept: 9, "sept.": 9, oct: 10, "oct.": 10, nov: 11, "nov.": 11, dec: 12, "dec.": 12 });
    	exports.INTEGER_WORD_DICTIONARY = {
    	    one: 1,
    	    two: 2,
    	    three: 3,
    	    four: 4,
    	    five: 5,
    	    six: 6,
    	    seven: 7,
    	    eight: 8,
    	    nine: 9,
    	    ten: 10,
    	    eleven: 11,
    	    twelve: 12,
    	};
    	exports.ORDINAL_WORD_DICTIONARY = {
    	    first: 1,
    	    second: 2,
    	    third: 3,
    	    fourth: 4,
    	    fifth: 5,
    	    sixth: 6,
    	    seventh: 7,
    	    eighth: 8,
    	    ninth: 9,
    	    tenth: 10,
    	    eleventh: 11,
    	    twelfth: 12,
    	    thirteenth: 13,
    	    fourteenth: 14,
    	    fifteenth: 15,
    	    sixteenth: 16,
    	    seventeenth: 17,
    	    eighteenth: 18,
    	    nineteenth: 19,
    	    twentieth: 20,
    	    "twenty first": 21,
    	    "twenty-first": 21,
    	    "twenty second": 22,
    	    "twenty-second": 22,
    	    "twenty third": 23,
    	    "twenty-third": 23,
    	    "twenty fourth": 24,
    	    "twenty-fourth": 24,
    	    "twenty fifth": 25,
    	    "twenty-fifth": 25,
    	    "twenty sixth": 26,
    	    "twenty-sixth": 26,
    	    "twenty seventh": 27,
    	    "twenty-seventh": 27,
    	    "twenty eighth": 28,
    	    "twenty-eighth": 28,
    	    "twenty ninth": 29,
    	    "twenty-ninth": 29,
    	    "thirtieth": 30,
    	    "thirty first": 31,
    	    "thirty-first": 31,
    	};
    	exports.TIME_UNIT_DICTIONARY = {
    	    s: "second",
    	    sec: "second",
    	    second: "second",
    	    seconds: "second",
    	    m: "minute",
    	    min: "minute",
    	    mins: "minute",
    	    minute: "minute",
    	    minutes: "minute",
    	    h: "hour",
    	    hr: "hour",
    	    hrs: "hour",
    	    hour: "hour",
    	    hours: "hour",
    	    d: "d",
    	    day: "d",
    	    days: "d",
    	    w: "w",
    	    week: "week",
    	    weeks: "week",
    	    mo: "month",
    	    mon: "month",
    	    mos: "month",
    	    month: "month",
    	    months: "month",
    	    qtr: "quarter",
    	    quarter: "quarter",
    	    quarters: "quarter",
    	    y: "year",
    	    yr: "year",
    	    year: "year",
    	    years: "year",
    	};
    	exports.NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s{0,2}an?)?|an?\\b(?:\\s{0,2}few)?|few|several|the|a?\\s{0,2}couple\\s{0,2}(?:of)?)`;
    	function parseNumberPattern(match) {
    	    const num = match.toLowerCase();
    	    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
    	        return exports.INTEGER_WORD_DICTIONARY[num];
    	    }
    	    else if (num === "a" || num === "an" || num == "the") {
    	        return 1;
    	    }
    	    else if (num.match(/few/)) {
    	        return 3;
    	    }
    	    else if (num.match(/half/)) {
    	        return 0.5;
    	    }
    	    else if (num.match(/couple/)) {
    	        return 2;
    	    }
    	    else if (num.match(/several/)) {
    	        return 7;
    	    }
    	    return parseFloat(num);
    	}
    	exports.parseNumberPattern = parseNumberPattern;
    	exports.ORDINAL_NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:st|nd|rd|th)?)`;
    	function parseOrdinalNumberPattern(match) {
    	    let num = match.toLowerCase();
    	    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
    	        return exports.ORDINAL_WORD_DICTIONARY[num];
    	    }
    	    num = num.replace(/(?:st|nd|rd|th)$/i, "");
    	    return parseInt(num);
    	}
    	exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
    	exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s{0,2}(?:BE|AD|BC|BCE|CE)|[1-2][0-9]{3}|[5-9][0-9])`;
    	function parseYear(match) {
    	    if (/BE/i.test(match)) {
    	        match = match.replace(/BE/i, "");
    	        return parseInt(match) - 543;
    	    }
    	    if (/BCE?/i.test(match)) {
    	        match = match.replace(/BCE?/i, "");
    	        return -parseInt(match);
    	    }
    	    if (/(AD|CE)/i.test(match)) {
    	        match = match.replace(/(AD|CE)/i, "");
    	        return parseInt(match);
    	    }
    	    const rawYearNumber = parseInt(match);
    	    return years_1.findMostLikelyADYear(rawYearNumber);
    	}
    	exports.parseYear = parseYear;
    	const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,3}(${pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})`;
    	const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
    	exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern(`(?:(?:about|around)\\s{0,3})?`, SINGLE_TIME_UNIT_PATTERN);
    	function parseTimeUnits(timeunitText) {
    	    const fragments = {};
    	    let remainingText = timeunitText;
    	    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    while (match) {
    	        collectDateTimeFragment(fragments, match);
    	        remainingText = remainingText.substring(match[0].length).trim();
    	        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    }
    	    return fragments;
    	}
    	exports.parseTimeUnits = parseTimeUnits;
    	function collectDateTimeFragment(fragments, match) {
    	    const num = parseNumberPattern(match[1]);
    	    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    	    fragments[unit] = num;
    	}
    	
    } (constants$9));

    var results = {};

    var quarterOfYearExports = {};
    var quarterOfYear = {
      get exports(){ return quarterOfYearExports; },
      set exports(v){ quarterOfYearExports = v; },
    };

    (function (module, exports) {
    	!function(t,n){module.exports=n();}(commonjsGlobal,(function(){var t="month",n="quarter";return function(e,i){var r=i.prototype;r.quarter=function(t){return this.$utils().u(t)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(t-1))};var s=r.add;r.add=function(e,i){return e=Number(e),this.$utils().p(i)===n?this.add(3*e,t):s.bind(this)(e,i)};var u=r.startOf;r.startOf=function(e,i){var r=this.$utils(),s=!!r.u(i)||i;if(r.p(e)===n){var o=this.quarter()-1;return s?this.month(3*o).startOf(t).startOf("day"):this.month(3*o+2).endOf(t).endOf("day")}return u.bind(this)(e,i)};}}));
    } (quarterOfYear));

    var dayjs = {};

    var hasRequiredDayjs;

    function requireDayjs () {
    	if (hasRequiredDayjs) return dayjs;
    	hasRequiredDayjs = 1;
    	Object.defineProperty(dayjs, "__esModule", { value: true });
    	dayjs.implySimilarTime = dayjs.implySimilarDate = dayjs.assignSimilarTime = dayjs.assignSimilarDate = dayjs.implyTheNextDay = dayjs.assignTheNextDay = void 0;
    	const index_1 = requireDist();
    	function assignTheNextDay(component, targetDayJs) {
    	    targetDayJs = targetDayJs.add(1, "day");
    	    assignSimilarDate(component, targetDayJs);
    	    implySimilarTime(component, targetDayJs);
    	}
    	dayjs.assignTheNextDay = assignTheNextDay;
    	function implyTheNextDay(component, targetDayJs) {
    	    targetDayJs = targetDayJs.add(1, "day");
    	    implySimilarDate(component, targetDayJs);
    	    implySimilarTime(component, targetDayJs);
    	}
    	dayjs.implyTheNextDay = implyTheNextDay;
    	function assignSimilarDate(component, targetDayJs) {
    	    component.assign("day", targetDayJs.date());
    	    component.assign("month", targetDayJs.month() + 1);
    	    component.assign("year", targetDayJs.year());
    	}
    	dayjs.assignSimilarDate = assignSimilarDate;
    	function assignSimilarTime(component, targetDayJs) {
    	    component.assign("hour", targetDayJs.hour());
    	    component.assign("minute", targetDayJs.minute());
    	    component.assign("second", targetDayJs.second());
    	    component.assign("millisecond", targetDayJs.millisecond());
    	    if (component.get("hour") < 12) {
    	        component.assign("meridiem", index_1.Meridiem.AM);
    	    }
    	    else {
    	        component.assign("meridiem", index_1.Meridiem.PM);
    	    }
    	}
    	dayjs.assignSimilarTime = assignSimilarTime;
    	function implySimilarDate(component, targetDayJs) {
    	    component.imply("day", targetDayJs.date());
    	    component.imply("month", targetDayJs.month() + 1);
    	    component.imply("year", targetDayJs.year());
    	}
    	dayjs.implySimilarDate = implySimilarDate;
    	function implySimilarTime(component, targetDayJs) {
    	    component.imply("hour", targetDayJs.hour());
    	    component.imply("minute", targetDayJs.minute());
    	    component.imply("second", targetDayJs.second());
    	    component.imply("millisecond", targetDayJs.millisecond());
    	}
    	dayjs.implySimilarTime = implySimilarTime;
    	
    	return dayjs;
    }

    var timezone = {};

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.toTimezoneOffset = exports.TIMEZONE_ABBR_MAP = void 0;
    	exports.TIMEZONE_ABBR_MAP = {
    	    ACDT: 630,
    	    ACST: 570,
    	    ADT: -180,
    	    AEDT: 660,
    	    AEST: 600,
    	    AFT: 270,
    	    AKDT: -480,
    	    AKST: -540,
    	    ALMT: 360,
    	    AMST: -180,
    	    AMT: -240,
    	    ANAST: 720,
    	    ANAT: 720,
    	    AQTT: 300,
    	    ART: -180,
    	    AST: -240,
    	    AWDT: 540,
    	    AWST: 480,
    	    AZOST: 0,
    	    AZOT: -60,
    	    AZST: 300,
    	    AZT: 240,
    	    BNT: 480,
    	    BOT: -240,
    	    BRST: -120,
    	    BRT: -180,
    	    BST: 60,
    	    BTT: 360,
    	    CAST: 480,
    	    CAT: 120,
    	    CCT: 390,
    	    CDT: -300,
    	    CEST: 120,
    	    CET: 60,
    	    CHADT: 825,
    	    CHAST: 765,
    	    CKT: -600,
    	    CLST: -180,
    	    CLT: -240,
    	    COT: -300,
    	    CST: -360,
    	    CVT: -60,
    	    CXT: 420,
    	    ChST: 600,
    	    DAVT: 420,
    	    EASST: -300,
    	    EAST: -360,
    	    EAT: 180,
    	    ECT: -300,
    	    EDT: -240,
    	    EEST: 180,
    	    EET: 120,
    	    EGST: 0,
    	    EGT: -60,
    	    EST: -300,
    	    ET: -300,
    	    FJST: 780,
    	    FJT: 720,
    	    FKST: -180,
    	    FKT: -240,
    	    FNT: -120,
    	    GALT: -360,
    	    GAMT: -540,
    	    GET: 240,
    	    GFT: -180,
    	    GILT: 720,
    	    GMT: 0,
    	    GST: 240,
    	    GYT: -240,
    	    HAA: -180,
    	    HAC: -300,
    	    HADT: -540,
    	    HAE: -240,
    	    HAP: -420,
    	    HAR: -360,
    	    HAST: -600,
    	    HAT: -90,
    	    HAY: -480,
    	    HKT: 480,
    	    HLV: -210,
    	    HNA: -240,
    	    HNC: -360,
    	    HNE: -300,
    	    HNP: -480,
    	    HNR: -420,
    	    HNT: -150,
    	    HNY: -540,
    	    HOVT: 420,
    	    ICT: 420,
    	    IDT: 180,
    	    IOT: 360,
    	    IRDT: 270,
    	    IRKST: 540,
    	    IRKT: 540,
    	    IRST: 210,
    	    IST: 330,
    	    JST: 540,
    	    KGT: 360,
    	    KRAST: 480,
    	    KRAT: 480,
    	    KST: 540,
    	    KUYT: 240,
    	    LHDT: 660,
    	    LHST: 630,
    	    LINT: 840,
    	    MAGST: 720,
    	    MAGT: 720,
    	    MART: -510,
    	    MAWT: 300,
    	    MDT: -360,
    	    MESZ: 120,
    	    MEZ: 60,
    	    MHT: 720,
    	    MMT: 390,
    	    MSD: 240,
    	    MSK: 180,
    	    MST: -420,
    	    MUT: 240,
    	    MVT: 300,
    	    MYT: 480,
    	    NCT: 660,
    	    NDT: -90,
    	    NFT: 690,
    	    NOVST: 420,
    	    NOVT: 360,
    	    NPT: 345,
    	    NST: -150,
    	    NUT: -660,
    	    NZDT: 780,
    	    NZST: 720,
    	    OMSST: 420,
    	    OMST: 420,
    	    PDT: -420,
    	    PET: -300,
    	    PETST: 720,
    	    PETT: 720,
    	    PGT: 600,
    	    PHOT: 780,
    	    PHT: 480,
    	    PKT: 300,
    	    PMDT: -120,
    	    PMST: -180,
    	    PONT: 660,
    	    PST: -480,
    	    PT: -480,
    	    PWT: 540,
    	    PYST: -180,
    	    PYT: -240,
    	    RET: 240,
    	    SAMT: 240,
    	    SAST: 120,
    	    SBT: 660,
    	    SCT: 240,
    	    SGT: 480,
    	    SRT: -180,
    	    SST: -660,
    	    TAHT: -600,
    	    TFT: 300,
    	    TJT: 300,
    	    TKT: 780,
    	    TLT: 540,
    	    TMT: 300,
    	    TVT: 720,
    	    ULAT: 480,
    	    UTC: 0,
    	    UYST: -120,
    	    UYT: -180,
    	    UZT: 300,
    	    VET: -210,
    	    VLAST: 660,
    	    VLAT: 660,
    	    VUT: 660,
    	    WAST: 120,
    	    WAT: 60,
    	    WEST: 60,
    	    WESZ: 60,
    	    WET: 0,
    	    WEZ: 0,
    	    WFT: 720,
    	    WGST: -120,
    	    WGT: -180,
    	    WIB: 420,
    	    WIT: 540,
    	    WITA: 480,
    	    WST: 780,
    	    WT: 0,
    	    YAKST: 600,
    	    YAKT: 600,
    	    YAPT: 600,
    	    YEKST: 360,
    	    YEKT: 360,
    	};
    	function toTimezoneOffset(timezoneInput) {
    	    var _a;
    	    if (timezoneInput === null || timezoneInput === undefined) {
    	        return null;
    	    }
    	    if (typeof timezoneInput === "number") {
    	        return timezoneInput;
    	    }
    	    return (_a = exports.TIMEZONE_ABBR_MAP[timezoneInput]) !== null && _a !== void 0 ? _a : null;
    	}
    	exports.toTimezoneOffset = toTimezoneOffset;
    	
    } (timezone));

    var hasRequiredResults;

    function requireResults () {
    	if (hasRequiredResults) return results;
    	hasRequiredResults = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(results, "__esModule", { value: true });
    	results.ParsingResult = results.ParsingComponents = results.ReferenceWithTimezone = void 0;
    	const quarterOfYear_1 = __importDefault(quarterOfYearExports);
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const dayjs_2 = requireDayjs();
    	const timezone_1 = timezone;
    	dayjs_1.default.extend(quarterOfYear_1.default);
    	class ReferenceWithTimezone {
    	    constructor(input) {
    	        var _a;
    	        input = input !== null && input !== void 0 ? input : new Date();
    	        if (input instanceof Date) {
    	            this.instant = input;
    	        }
    	        else {
    	            this.instant = (_a = input.instant) !== null && _a !== void 0 ? _a : new Date();
    	            this.timezoneOffset = timezone_1.toTimezoneOffset(input.timezone);
    	        }
    	    }
    	    getDateWithAdjustedTimezone() {
    	        return new Date(this.instant.getTime() + this.getSystemTimezoneAdjustmentMinute(this.instant) * 60000);
    	    }
    	    getSystemTimezoneAdjustmentMinute(date, overrideTimezoneOffset) {
    	        var _a;
    	        if (!date || date.getTime() < 0) {
    	            date = new Date();
    	        }
    	        const currentTimezoneOffset = -date.getTimezoneOffset();
    	        const targetTimezoneOffset = (_a = overrideTimezoneOffset !== null && overrideTimezoneOffset !== void 0 ? overrideTimezoneOffset : this.timezoneOffset) !== null && _a !== void 0 ? _a : currentTimezoneOffset;
    	        return currentTimezoneOffset - targetTimezoneOffset;
    	    }
    	}
    	results.ReferenceWithTimezone = ReferenceWithTimezone;
    	class ParsingComponents {
    	    constructor(reference, knownComponents) {
    	        this.reference = reference;
    	        this.knownValues = {};
    	        this.impliedValues = {};
    	        if (knownComponents) {
    	            for (const key in knownComponents) {
    	                this.knownValues[key] = knownComponents[key];
    	            }
    	        }
    	        const refDayJs = dayjs_1.default(reference.instant);
    	        this.imply("day", refDayJs.date());
    	        this.imply("month", refDayJs.month() + 1);
    	        this.imply("year", refDayJs.year());
    	        this.imply("hour", 12);
    	        this.imply("minute", 0);
    	        this.imply("second", 0);
    	        this.imply("millisecond", 0);
    	    }
    	    get(component) {
    	        if (component in this.knownValues) {
    	            return this.knownValues[component];
    	        }
    	        if (component in this.impliedValues) {
    	            return this.impliedValues[component];
    	        }
    	        return null;
    	    }
    	    isCertain(component) {
    	        return component in this.knownValues;
    	    }
    	    getCertainComponents() {
    	        return Object.keys(this.knownValues);
    	    }
    	    imply(component, value) {
    	        if (component in this.knownValues) {
    	            return this;
    	        }
    	        this.impliedValues[component] = value;
    	        return this;
    	    }
    	    assign(component, value) {
    	        this.knownValues[component] = value;
    	        delete this.impliedValues[component];
    	        return this;
    	    }
    	    delete(component) {
    	        delete this.knownValues[component];
    	        delete this.impliedValues[component];
    	    }
    	    clone() {
    	        const component = new ParsingComponents(this.reference);
    	        component.knownValues = {};
    	        component.impliedValues = {};
    	        for (const key in this.knownValues) {
    	            component.knownValues[key] = this.knownValues[key];
    	        }
    	        for (const key in this.impliedValues) {
    	            component.impliedValues[key] = this.impliedValues[key];
    	        }
    	        return component;
    	    }
    	    isOnlyDate() {
    	        return !this.isCertain("hour") && !this.isCertain("minute") && !this.isCertain("second");
    	    }
    	    isOnlyTime() {
    	        return !this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
    	    }
    	    isOnlyWeekdayComponent() {
    	        return this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
    	    }
    	    isOnlyDayMonthComponent() {
    	        return this.isCertain("day") && this.isCertain("month") && !this.isCertain("year");
    	    }
    	    isValidDate() {
    	        const date = this.dateWithoutTimezoneAdjustment();
    	        if (date.getFullYear() !== this.get("year"))
    	            return false;
    	        if (date.getMonth() !== this.get("month") - 1)
    	            return false;
    	        if (date.getDate() !== this.get("day"))
    	            return false;
    	        if (this.get("hour") != null && date.getHours() != this.get("hour"))
    	            return false;
    	        if (this.get("minute") != null && date.getMinutes() != this.get("minute"))
    	            return false;
    	        return true;
    	    }
    	    toString() {
    	        return `[ParsingComponents {knownValues: ${JSON.stringify(this.knownValues)}, impliedValues: ${JSON.stringify(this.impliedValues)}}, reference: ${JSON.stringify(this.reference)}]`;
    	    }
    	    dayjs() {
    	        return dayjs_1.default(this.date());
    	    }
    	    date() {
    	        const date = this.dateWithoutTimezoneAdjustment();
    	        const timezoneAdjustment = this.reference.getSystemTimezoneAdjustmentMinute(date, this.get("timezoneOffset"));
    	        return new Date(date.getTime() + timezoneAdjustment * 60000);
    	    }
    	    dateWithoutTimezoneAdjustment() {
    	        const date = new Date(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond"));
    	        date.setFullYear(this.get("year"));
    	        return date;
    	    }
    	    static createRelativeFromReference(reference, fragments) {
    	        let date = dayjs_1.default(reference.instant);
    	        for (const key in fragments) {
    	            date = date.add(fragments[key], key);
    	        }
    	        const components = new ParsingComponents(reference);
    	        if (fragments["hour"] || fragments["minute"] || fragments["second"]) {
    	            dayjs_2.assignSimilarTime(components, date);
    	            dayjs_2.assignSimilarDate(components, date);
    	            if (reference.timezoneOffset !== null) {
    	                components.assign("timezoneOffset", -reference.instant.getTimezoneOffset());
    	            }
    	        }
    	        else {
    	            dayjs_2.implySimilarTime(components, date);
    	            if (reference.timezoneOffset !== null) {
    	                components.imply("timezoneOffset", -reference.instant.getTimezoneOffset());
    	            }
    	            if (fragments["d"]) {
    	                components.assign("day", date.date());
    	                components.assign("month", date.month() + 1);
    	                components.assign("year", date.year());
    	            }
    	            else {
    	                if (fragments["week"]) {
    	                    components.imply("weekday", date.day());
    	                }
    	                components.imply("day", date.date());
    	                if (fragments["month"]) {
    	                    components.assign("month", date.month() + 1);
    	                    components.assign("year", date.year());
    	                }
    	                else {
    	                    components.imply("month", date.month() + 1);
    	                    if (fragments["year"]) {
    	                        components.assign("year", date.year());
    	                    }
    	                    else {
    	                        components.imply("year", date.year());
    	                    }
    	                }
    	            }
    	        }
    	        return components;
    	    }
    	}
    	results.ParsingComponents = ParsingComponents;
    	class ParsingResult {
    	    constructor(reference, index, text, start, end) {
    	        this.reference = reference;
    	        this.refDate = reference.instant;
    	        this.index = index;
    	        this.text = text;
    	        this.start = start || new ParsingComponents(reference);
    	        this.end = end;
    	    }
    	    clone() {
    	        const result = new ParsingResult(this.reference, this.index, this.text);
    	        result.start = this.start ? this.start.clone() : null;
    	        result.end = this.end ? this.end.clone() : null;
    	        return result;
    	    }
    	    date() {
    	        return this.start.date();
    	    }
    	    toString() {
    	        return `[ParsingResult {index: ${this.index}, text: '${this.text}', ...}]`;
    	    }
    	}
    	results.ParsingResult = ParsingResult;
    	
    	return results;
    }

    var AbstractParserWithWordBoundary = {};

    Object.defineProperty(AbstractParserWithWordBoundary, "__esModule", { value: true });
    AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking = void 0;
    class AbstractParserWithWordBoundaryChecking {
        constructor() {
            this.cachedInnerPattern = null;
            this.cachedPattern = null;
        }
        patternLeftBoundary() {
            return `(\\W|^)`;
        }
        pattern(context) {
            const innerPattern = this.innerPattern(context);
            if (innerPattern == this.cachedInnerPattern) {
                return this.cachedPattern;
            }
            this.cachedPattern = new RegExp(`${this.patternLeftBoundary()}${innerPattern.source}`, innerPattern.flags);
            this.cachedInnerPattern = innerPattern;
            return this.cachedPattern;
        }
        extract(context, match) {
            var _a;
            const header = (_a = match[1]) !== null && _a !== void 0 ? _a : "";
            match.index = match.index + header.length;
            match[0] = match[0].substring(header.length);
            for (let i = 2; i < match.length; i++) {
                match[i - 1] = match[i];
            }
            return this.innerExtract(context, match);
        }
    }
    AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking = AbstractParserWithWordBoundaryChecking;

    var hasRequiredENTimeUnitWithinFormatParser;

    function requireENTimeUnitWithinFormatParser () {
    	if (hasRequiredENTimeUnitWithinFormatParser) return ENTimeUnitWithinFormatParser;
    	hasRequiredENTimeUnitWithinFormatParser = 1;
    	Object.defineProperty(ENTimeUnitWithinFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$9;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const PATTERN_WITH_PREFIX = new RegExp(`(?:within|in|for)\\s*` +
    	    `(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${constants_1.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    	const PATTERN_WITHOUT_PREFIX = new RegExp(`(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${constants_1.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    	let ENTimeUnitWithinFormatParser$1 = class ENTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern(context) {
    	        return context.option.forwardDate ? PATTERN_WITHOUT_PREFIX : PATTERN_WITH_PREFIX;
    	    }
    	    innerExtract(context, match) {
    	        const timeUnits = constants_1.parseTimeUnits(match[1]);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	    }
    	};
    	ENTimeUnitWithinFormatParser.default = ENTimeUnitWithinFormatParser$1;
    	
    	return ENTimeUnitWithinFormatParser;
    }

    var ENMonthNameLittleEndianParser$1 = {};

    Object.defineProperty(ENMonthNameLittleEndianParser$1, "__esModule", { value: true });
    const years_1$c = years;
    const constants_1$n = constants$9;
    const constants_2$a = constants$9;
    const constants_3$4 = constants$9;
    const pattern_1$c = pattern;
    const AbstractParserWithWordBoundary_1$r = AbstractParserWithWordBoundary;
    const PATTERN$n = new RegExp(`(?:on\\s{0,3})?` +
        `(${constants_3$4.ORDINAL_NUMBER_PATTERN})` +
        `(?:` +
        `\\s{0,3}(?:to|\\-|\\–|until|through|till)?\\s{0,3}` +
        `(${constants_3$4.ORDINAL_NUMBER_PATTERN})` +
        ")?" +
        `(?:-|/|\\s{0,3}(?:of)?\\s{0,3})` +
        `(${pattern_1$c.matchAnyPattern(constants_1$n.MONTH_DICTIONARY)})` +
        "(?:" +
        `(?:-|/|,?\\s{0,3})` +
        `(${constants_2$a.YEAR_PATTERN}(?![^\\s]\\d))` +
        ")?" +
        "(?=\\W|$)", "i");
    const DATE_GROUP$7 = 1;
    const DATE_TO_GROUP$7 = 2;
    const MONTH_NAME_GROUP$c = 3;
    const YEAR_GROUP$f = 4;
    class ENMonthNameLittleEndianParser extends AbstractParserWithWordBoundary_1$r.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$n;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            const month = constants_1$n.MONTH_DICTIONARY[match[MONTH_NAME_GROUP$c].toLowerCase()];
            const day = constants_3$4.parseOrdinalNumberPattern(match[DATE_GROUP$7]);
            if (day > 31) {
                match.index = match.index + match[DATE_GROUP$7].length;
                return null;
            }
            result.start.assign("month", month);
            result.start.assign("day", day);
            if (match[YEAR_GROUP$f]) {
                const yearNumber = constants_2$a.parseYear(match[YEAR_GROUP$f]);
                result.start.assign("year", yearNumber);
            }
            else {
                const year = years_1$c.findYearClosestToRef(context.refDate, day, month);
                result.start.imply("year", year);
            }
            if (match[DATE_TO_GROUP$7]) {
                const endDate = constants_3$4.parseOrdinalNumberPattern(match[DATE_TO_GROUP$7]);
                result.end = result.start.clone();
                result.end.assign("day", endDate);
            }
            return result;
        }
    }
    ENMonthNameLittleEndianParser$1.default = ENMonthNameLittleEndianParser;

    var ENMonthNameMiddleEndianParser$1 = {};

    Object.defineProperty(ENMonthNameMiddleEndianParser$1, "__esModule", { value: true });
    const years_1$b = years;
    const constants_1$m = constants$9;
    const constants_2$9 = constants$9;
    const constants_3$3 = constants$9;
    const pattern_1$b = pattern;
    const AbstractParserWithWordBoundary_1$q = AbstractParserWithWordBoundary;
    const PATTERN$m = new RegExp(`(${pattern_1$b.matchAnyPattern(constants_1$m.MONTH_DICTIONARY)})` +
        "(?:-|/|\\s*,?\\s*)" +
        `(${constants_2$9.ORDINAL_NUMBER_PATTERN})(?!\\s*(?:am|pm))\\s*` +
        "(?:" +
        "(?:to|\\-)\\s*" +
        `(${constants_2$9.ORDINAL_NUMBER_PATTERN})\\s*` +
        ")?" +
        "(?:" +
        "(?:-|/|\\s*,?\\s*)" +
        `(${constants_3$3.YEAR_PATTERN})` +
        ")?" +
        "(?=\\W|$)(?!\\:\\d)", "i");
    const MONTH_NAME_GROUP$b = 1;
    const DATE_GROUP$6 = 2;
    const DATE_TO_GROUP$6 = 3;
    const YEAR_GROUP$e = 4;
    class ENMonthNameMiddleEndianParser extends AbstractParserWithWordBoundary_1$q.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$m;
        }
        innerExtract(context, match) {
            const month = constants_1$m.MONTH_DICTIONARY[match[MONTH_NAME_GROUP$b].toLowerCase()];
            const day = constants_2$9.parseOrdinalNumberPattern(match[DATE_GROUP$6]);
            if (day > 31) {
                return null;
            }
            const components = context.createParsingComponents({
                day: day,
                month: month,
            });
            if (match[YEAR_GROUP$e]) {
                const year = constants_3$3.parseYear(match[YEAR_GROUP$e]);
                components.assign("year", year);
            }
            else {
                const year = years_1$b.findYearClosestToRef(context.refDate, day, month);
                components.imply("year", year);
            }
            if (!match[DATE_TO_GROUP$6]) {
                return components;
            }
            const endDate = constants_2$9.parseOrdinalNumberPattern(match[DATE_TO_GROUP$6]);
            const result = context.createParsingResult(match.index, match[0]);
            result.start = components;
            result.end = components.clone();
            result.end.assign("day", endDate);
            return result;
        }
    }
    ENMonthNameMiddleEndianParser$1.default = ENMonthNameMiddleEndianParser;

    var ENMonthNameParser$1 = {};

    Object.defineProperty(ENMonthNameParser$1, "__esModule", { value: true });
    const constants_1$l = constants$9;
    const years_1$a = years;
    const pattern_1$a = pattern;
    const constants_2$8 = constants$9;
    const AbstractParserWithWordBoundary_1$p = AbstractParserWithWordBoundary;
    const PATTERN$l = new RegExp(`((?:in)\\s*)?` +
        `(${pattern_1$a.matchAnyPattern(constants_1$l.MONTH_DICTIONARY)})` +
        `\\s*` +
        `(?:` +
        `[,-]?\\s*(${constants_2$8.YEAR_PATTERN})?` +
        ")?" +
        "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
    const PREFIX_GROUP = 1;
    const MONTH_NAME_GROUP$a = 2;
    const YEAR_GROUP$d = 3;
    class ENMonthNameParser extends AbstractParserWithWordBoundary_1$p.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$l;
        }
        innerExtract(context, match) {
            const monthName = match[MONTH_NAME_GROUP$a].toLowerCase();
            if (match[0].length <= 3 && !constants_1$l.FULL_MONTH_NAME_DICTIONARY[monthName]) {
                return null;
            }
            const result = context.createParsingResult(match.index + (match[PREFIX_GROUP] || "").length, match.index + match[0].length);
            result.start.imply("day", 1);
            const month = constants_1$l.MONTH_DICTIONARY[monthName];
            result.start.assign("month", month);
            if (match[YEAR_GROUP$d]) {
                const year = constants_2$8.parseYear(match[YEAR_GROUP$d]);
                result.start.assign("year", year);
            }
            else {
                const year = years_1$a.findYearClosestToRef(context.refDate, 1, month);
                result.start.imply("year", year);
            }
            return result;
        }
    }
    ENMonthNameParser$1.default = ENMonthNameParser;

    var ENCasualYearMonthDayParser$1 = {};

    Object.defineProperty(ENCasualYearMonthDayParser$1, "__esModule", { value: true });
    const constants_1$k = constants$9;
    const pattern_1$9 = pattern;
    const AbstractParserWithWordBoundary_1$o = AbstractParserWithWordBoundary;
    const PATTERN$k = new RegExp(`([0-9]{4})[\\.\\/\\s]` +
        `(?:(${pattern_1$9.matchAnyPattern(constants_1$k.MONTH_DICTIONARY)})|([0-9]{1,2}))[\\.\\/\\s]` +
        `([0-9]{1,2})` +
        "(?=\\W|$)", "i");
    const YEAR_NUMBER_GROUP$3 = 1;
    const MONTH_NAME_GROUP$9 = 2;
    const MONTH_NUMBER_GROUP$2 = 3;
    const DATE_NUMBER_GROUP$2 = 4;
    class ENCasualYearMonthDayParser extends AbstractParserWithWordBoundary_1$o.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$k;
        }
        innerExtract(context, match) {
            const month = match[MONTH_NUMBER_GROUP$2]
                ? parseInt(match[MONTH_NUMBER_GROUP$2])
                : constants_1$k.MONTH_DICTIONARY[match[MONTH_NAME_GROUP$9].toLowerCase()];
            if (month < 1 || month > 12) {
                return null;
            }
            const year = parseInt(match[YEAR_NUMBER_GROUP$3]);
            const day = parseInt(match[DATE_NUMBER_GROUP$2]);
            return {
                day: day,
                month: month,
                year: year,
            };
        }
    }
    ENCasualYearMonthDayParser$1.default = ENCasualYearMonthDayParser;

    var ENSlashMonthFormatParser$1 = {};

    Object.defineProperty(ENSlashMonthFormatParser$1, "__esModule", { value: true });
    const AbstractParserWithWordBoundary_1$n = AbstractParserWithWordBoundary;
    const PATTERN$j = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})" + "", "i");
    const MONTH_GROUP$4 = 1;
    const YEAR_GROUP$c = 2;
    class ENSlashMonthFormatParser extends AbstractParserWithWordBoundary_1$n.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$j;
        }
        innerExtract(context, match) {
            const year = parseInt(match[YEAR_GROUP$c]);
            const month = parseInt(match[MONTH_GROUP$4]);
            return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
        }
    }
    ENSlashMonthFormatParser$1.default = ENSlashMonthFormatParser;

    var ENTimeExpressionParser = {};

    var AbstractTimeExpressionParser = {};

    var hasRequiredAbstractTimeExpressionParser;

    function requireAbstractTimeExpressionParser () {
    	if (hasRequiredAbstractTimeExpressionParser) return AbstractTimeExpressionParser;
    	hasRequiredAbstractTimeExpressionParser = 1;
    	Object.defineProperty(AbstractTimeExpressionParser, "__esModule", { value: true });
    	AbstractTimeExpressionParser.AbstractTimeExpressionParser = void 0;
    	const index_1 = requireDist();
    	function primaryTimePattern(leftBoundary, primaryPrefix, primarySuffix, flags) {
    	    return new RegExp(`${leftBoundary}` +
    	        `${primaryPrefix}` +
    	        `(\\d{1,4})` +
    	        `(?:` +
    	        `(?:\\.|:|：)` +
    	        `(\\d{1,2})` +
    	        `(?:` +
    	        `(?::|：)` +
    	        `(\\d{2})` +
    	        `(?:\\.(\\d{1,6}))?` +
    	        `)?` +
    	        `)?` +
    	        `(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?` +
    	        `${primarySuffix}`, flags);
    	}
    	function followingTimePatten(followingPhase, followingSuffix) {
    	    return new RegExp(`^(${followingPhase})` +
    	        `(\\d{1,4})` +
    	        `(?:` +
    	        `(?:\\.|\\:|\\：)` +
    	        `(\\d{1,2})` +
    	        `(?:` +
    	        `(?:\\.|\\:|\\：)` +
    	        `(\\d{1,2})(?:\\.(\\d{1,6}))?` +
    	        `)?` +
    	        `)?` +
    	        `(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?` +
    	        `${followingSuffix}`, "i");
    	}
    	const HOUR_GROUP = 2;
    	const MINUTE_GROUP = 3;
    	const SECOND_GROUP = 4;
    	const MILLI_SECOND_GROUP = 5;
    	const AM_PM_HOUR_GROUP = 6;
    	let AbstractTimeExpressionParser$1 = class AbstractTimeExpressionParser {
    	    constructor(strictMode = false) {
    	        this.cachedPrimaryPrefix = null;
    	        this.cachedPrimarySuffix = null;
    	        this.cachedPrimaryTimePattern = null;
    	        this.cachedFollowingPhase = null;
    	        this.cachedFollowingSuffix = null;
    	        this.cachedFollowingTimePatten = null;
    	        this.strictMode = strictMode;
    	    }
    	    patternFlags() {
    	        return "i";
    	    }
    	    primaryPatternLeftBoundary() {
    	        return `(^|\\s|T|\\b)`;
    	    }
    	    primarySuffix() {
    	        return `(?=\\W|$)`;
    	    }
    	    followingSuffix() {
    	        return `(?=\\W|$)`;
    	    }
    	    pattern(context) {
    	        return this.getPrimaryTimePatternThroughCache();
    	    }
    	    extract(context, match) {
    	        const startComponents = this.extractPrimaryTimeComponents(context, match);
    	        if (!startComponents) {
    	            match.index += match[0].length;
    	            return null;
    	        }
    	        const index = match.index + match[1].length;
    	        const text = match[0].substring(match[1].length);
    	        const result = context.createParsingResult(index, text, startComponents);
    	        match.index += match[0].length;
    	        const remainingText = context.text.substring(match.index);
    	        const followingPattern = this.getFollowingTimePatternThroughCache();
    	        const followingMatch = followingPattern.exec(remainingText);
    	        if (text.match(/^\d{3,4}/) && followingMatch && followingMatch[0].match(/^\s*([+-])\s*\d{2,4}$/)) {
    	            return null;
    	        }
    	        if (!followingMatch ||
    	            followingMatch[0].match(/^\s*([+-])\s*\d{3,4}$/)) {
    	            return this.checkAndReturnWithoutFollowingPattern(result);
    	        }
    	        result.end = this.extractFollowingTimeComponents(context, followingMatch, result);
    	        if (result.end) {
    	            result.text += followingMatch[0];
    	        }
    	        return this.checkAndReturnWithFollowingPattern(result);
    	    }
    	    extractPrimaryTimeComponents(context, match, strict = false) {
    	        const components = context.createParsingComponents();
    	        let minute = 0;
    	        let meridiem = null;
    	        let hour = parseInt(match[HOUR_GROUP]);
    	        if (hour > 100) {
    	            if (this.strictMode || match[MINUTE_GROUP] != null) {
    	                return null;
    	            }
    	            minute = hour % 100;
    	            hour = Math.floor(hour / 100);
    	        }
    	        if (hour > 24) {
    	            return null;
    	        }
    	        if (match[MINUTE_GROUP] != null) {
    	            if (match[MINUTE_GROUP].length == 1 && !match[AM_PM_HOUR_GROUP]) {
    	                return null;
    	            }
    	            minute = parseInt(match[MINUTE_GROUP]);
    	        }
    	        if (minute >= 60) {
    	            return null;
    	        }
    	        if (hour > 12) {
    	            meridiem = index_1.Meridiem.PM;
    	        }
    	        if (match[AM_PM_HOUR_GROUP] != null) {
    	            if (hour > 12)
    	                return null;
    	            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
    	            if (ampm == "a") {
    	                meridiem = index_1.Meridiem.AM;
    	                if (hour == 12) {
    	                    hour = 0;
    	                }
    	            }
    	            if (ampm == "p") {
    	                meridiem = index_1.Meridiem.PM;
    	                if (hour != 12) {
    	                    hour += 12;
    	                }
    	            }
    	        }
    	        components.assign("hour", hour);
    	        components.assign("minute", minute);
    	        if (meridiem !== null) {
    	            components.assign("meridiem", meridiem);
    	        }
    	        else {
    	            if (hour < 12) {
    	                components.imply("meridiem", index_1.Meridiem.AM);
    	            }
    	            else {
    	                components.imply("meridiem", index_1.Meridiem.PM);
    	            }
    	        }
    	        if (match[MILLI_SECOND_GROUP] != null) {
    	            const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
    	            if (millisecond >= 1000)
    	                return null;
    	            components.assign("millisecond", millisecond);
    	        }
    	        if (match[SECOND_GROUP] != null) {
    	            const second = parseInt(match[SECOND_GROUP]);
    	            if (second >= 60)
    	                return null;
    	            components.assign("second", second);
    	        }
    	        return components;
    	    }
    	    extractFollowingTimeComponents(context, match, result) {
    	        const components = context.createParsingComponents();
    	        if (match[MILLI_SECOND_GROUP] != null) {
    	            const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
    	            if (millisecond >= 1000)
    	                return null;
    	            components.assign("millisecond", millisecond);
    	        }
    	        if (match[SECOND_GROUP] != null) {
    	            const second = parseInt(match[SECOND_GROUP]);
    	            if (second >= 60)
    	                return null;
    	            components.assign("second", second);
    	        }
    	        let hour = parseInt(match[HOUR_GROUP]);
    	        let minute = 0;
    	        let meridiem = -1;
    	        if (match[MINUTE_GROUP] != null) {
    	            minute = parseInt(match[MINUTE_GROUP]);
    	        }
    	        else if (hour > 100) {
    	            minute = hour % 100;
    	            hour = Math.floor(hour / 100);
    	        }
    	        if (minute >= 60 || hour > 24) {
    	            return null;
    	        }
    	        if (hour >= 12) {
    	            meridiem = index_1.Meridiem.PM;
    	        }
    	        if (match[AM_PM_HOUR_GROUP] != null) {
    	            if (hour > 12) {
    	                return null;
    	            }
    	            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
    	            if (ampm == "a") {
    	                meridiem = index_1.Meridiem.AM;
    	                if (hour == 12) {
    	                    hour = 0;
    	                    if (!components.isCertain("day")) {
    	                        components.imply("day", components.get("day") + 1);
    	                    }
    	                }
    	            }
    	            if (ampm == "p") {
    	                meridiem = index_1.Meridiem.PM;
    	                if (hour != 12)
    	                    hour += 12;
    	            }
    	            if (!result.start.isCertain("meridiem")) {
    	                if (meridiem == index_1.Meridiem.AM) {
    	                    result.start.imply("meridiem", index_1.Meridiem.AM);
    	                    if (result.start.get("hour") == 12) {
    	                        result.start.assign("hour", 0);
    	                    }
    	                }
    	                else {
    	                    result.start.imply("meridiem", index_1.Meridiem.PM);
    	                    if (result.start.get("hour") != 12) {
    	                        result.start.assign("hour", result.start.get("hour") + 12);
    	                    }
    	                }
    	            }
    	        }
    	        components.assign("hour", hour);
    	        components.assign("minute", minute);
    	        if (meridiem >= 0) {
    	            components.assign("meridiem", meridiem);
    	        }
    	        else {
    	            const startAtPM = result.start.isCertain("meridiem") && result.start.get("hour") > 12;
    	            if (startAtPM) {
    	                if (result.start.get("hour") - 12 > hour) {
    	                    components.imply("meridiem", index_1.Meridiem.AM);
    	                }
    	                else if (hour <= 12) {
    	                    components.assign("hour", hour + 12);
    	                    components.assign("meridiem", index_1.Meridiem.PM);
    	                }
    	            }
    	            else if (hour > 12) {
    	                components.imply("meridiem", index_1.Meridiem.PM);
    	            }
    	            else if (hour <= 12) {
    	                components.imply("meridiem", index_1.Meridiem.AM);
    	            }
    	        }
    	        if (components.date().getTime() < result.start.date().getTime()) {
    	            components.imply("day", components.get("day") + 1);
    	        }
    	        return components;
    	    }
    	    checkAndReturnWithoutFollowingPattern(result) {
    	        if (result.text.match(/^\d$/)) {
    	            return null;
    	        }
    	        if (result.text.match(/^\d\d\d+$/)) {
    	            return null;
    	        }
    	        if (result.text.match(/\d[apAP]$/)) {
    	            return null;
    	        }
    	        const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)$/);
    	        if (endingWithNumbers) {
    	            const endingNumbers = endingWithNumbers[1];
    	            if (this.strictMode) {
    	                return null;
    	            }
    	            if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
    	                return null;
    	            }
    	            const endingNumberVal = parseInt(endingNumbers);
    	            if (endingNumberVal > 24) {
    	                return null;
    	            }
    	        }
    	        return result;
    	    }
    	    checkAndReturnWithFollowingPattern(result) {
    	        if (result.text.match(/^\d+-\d+$/)) {
    	            return null;
    	        }
    	        const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)\s*-\s*(\d[\d.]+)$/);
    	        if (endingWithNumbers) {
    	            if (this.strictMode) {
    	                return null;
    	            }
    	            const startingNumbers = endingWithNumbers[1];
    	            const endingNumbers = endingWithNumbers[2];
    	            if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
    	                return null;
    	            }
    	            const endingNumberVal = parseInt(endingNumbers);
    	            const startingNumberVal = parseInt(startingNumbers);
    	            if (endingNumberVal > 24 || startingNumberVal > 24) {
    	                return null;
    	            }
    	        }
    	        return result;
    	    }
    	    getPrimaryTimePatternThroughCache() {
    	        const primaryPrefix = this.primaryPrefix();
    	        const primarySuffix = this.primarySuffix();
    	        if (this.cachedPrimaryPrefix === primaryPrefix && this.cachedPrimarySuffix === primarySuffix) {
    	            return this.cachedPrimaryTimePattern;
    	        }
    	        this.cachedPrimaryTimePattern = primaryTimePattern(this.primaryPatternLeftBoundary(), primaryPrefix, primarySuffix, this.patternFlags());
    	        this.cachedPrimaryPrefix = primaryPrefix;
    	        this.cachedPrimarySuffix = primarySuffix;
    	        return this.cachedPrimaryTimePattern;
    	    }
    	    getFollowingTimePatternThroughCache() {
    	        const followingPhase = this.followingPhase();
    	        const followingSuffix = this.followingSuffix();
    	        if (this.cachedFollowingPhase === followingPhase && this.cachedFollowingSuffix === followingSuffix) {
    	            return this.cachedFollowingTimePatten;
    	        }
    	        this.cachedFollowingTimePatten = followingTimePatten(followingPhase, followingSuffix);
    	        this.cachedFollowingPhase = followingPhase;
    	        this.cachedFollowingSuffix = followingSuffix;
    	        return this.cachedFollowingTimePatten;
    	    }
    	};
    	AbstractTimeExpressionParser.AbstractTimeExpressionParser = AbstractTimeExpressionParser$1;
    	
    	return AbstractTimeExpressionParser;
    }

    var hasRequiredENTimeExpressionParser;

    function requireENTimeExpressionParser () {
    	if (hasRequiredENTimeExpressionParser) return ENTimeExpressionParser;
    	hasRequiredENTimeExpressionParser = 1;
    	Object.defineProperty(ENTimeExpressionParser, "__esModule", { value: true });
    	const index_1 = requireDist();
    	const AbstractTimeExpressionParser_1 = requireAbstractTimeExpressionParser();
    	let ENTimeExpressionParser$1 = class ENTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    	    constructor(strictMode) {
    	        super(strictMode);
    	    }
    	    followingPhase() {
    	        return "\\s*(?:\\-|\\–|\\~|\\〜|to|until|through|till|\\?)\\s*";
    	    }
    	    primaryPrefix() {
    	        return "(?:(?:at|from)\\s*)??";
    	    }
    	    primarySuffix() {
    	        return "(?:\\s*(?:o\\W*clock|at\\s*night|in\\s*the\\s*(?:morning|afternoon)))?(?!/)(?=\\W|$)";
    	    }
    	    extractPrimaryTimeComponents(context, match) {
    	        const components = super.extractPrimaryTimeComponents(context, match);
    	        if (components) {
    	            if (match[0].endsWith("night")) {
    	                const hour = components.get("hour");
    	                if (hour >= 6 && hour < 12) {
    	                    components.assign("hour", components.get("hour") + 12);
    	                    components.assign("meridiem", index_1.Meridiem.PM);
    	                }
    	                else if (hour < 6) {
    	                    components.assign("meridiem", index_1.Meridiem.AM);
    	                }
    	            }
    	            if (match[0].endsWith("afternoon")) {
    	                components.assign("meridiem", index_1.Meridiem.PM);
    	                const hour = components.get("hour");
    	                if (hour >= 0 && hour <= 6) {
    	                    components.assign("hour", components.get("hour") + 12);
    	                }
    	            }
    	            if (match[0].endsWith("morning")) {
    	                components.assign("meridiem", index_1.Meridiem.AM);
    	                const hour = components.get("hour");
    	                if (hour < 12) {
    	                    components.assign("hour", components.get("hour"));
    	                }
    	            }
    	        }
    	        return components;
    	    }
    	};
    	ENTimeExpressionParser.default = ENTimeExpressionParser$1;
    	
    	return ENTimeExpressionParser;
    }

    var ENTimeUnitAgoFormatParser = {};

    var timeunits = {};

    Object.defineProperty(timeunits, "__esModule", { value: true });
    timeunits.addImpliedTimeUnits = timeunits.reverseTimeUnits = void 0;
    function reverseTimeUnits(timeUnits) {
        const reversed = {};
        for (const key in timeUnits) {
            reversed[key] = -timeUnits[key];
        }
        return reversed;
    }
    timeunits.reverseTimeUnits = reverseTimeUnits;
    function addImpliedTimeUnits(components, timeUnits) {
        const output = components.clone();
        let date = components.dayjs();
        for (const key in timeUnits) {
            date = date.add(timeUnits[key], key);
        }
        if ("day" in timeUnits || "d" in timeUnits || "week" in timeUnits || "month" in timeUnits || "year" in timeUnits) {
            output.imply("day", date.date());
            output.imply("month", date.month() + 1);
            output.imply("year", date.year());
        }
        if ("second" in timeUnits || "minute" in timeUnits || "hour" in timeUnits) {
            output.imply("second", date.second());
            output.imply("minute", date.minute());
            output.imply("hour", date.hour());
        }
        return output;
    }
    timeunits.addImpliedTimeUnits = addImpliedTimeUnits;

    var hasRequiredENTimeUnitAgoFormatParser;

    function requireENTimeUnitAgoFormatParser () {
    	if (hasRequiredENTimeUnitAgoFormatParser) return ENTimeUnitAgoFormatParser;
    	hasRequiredENTimeUnitAgoFormatParser = 1;
    	Object.defineProperty(ENTimeUnitAgoFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$9;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const timeunits_1 = timeunits;
    	const PATTERN = new RegExp(`(${constants_1.TIME_UNITS_PATTERN})\\s{0,5}(?:ago|before|earlier)(?=(?:\\W|$))`, "i");
    	const STRICT_PATTERN = new RegExp(`(${constants_1.TIME_UNITS_PATTERN})\\s{0,5}ago(?=(?:\\W|$))`, "i");
    	let ENTimeUnitAgoFormatParser$1 = class ENTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    constructor(strictMode) {
    	        super();
    	        this.strictMode = strictMode;
    	    }
    	    innerPattern() {
    	        return this.strictMode ? STRICT_PATTERN : PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const timeUnits = constants_1.parseTimeUnits(match[1]);
    	        const outputTimeUnits = timeunits_1.reverseTimeUnits(timeUnits);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
    	    }
    	};
    	ENTimeUnitAgoFormatParser.default = ENTimeUnitAgoFormatParser$1;
    	
    	return ENTimeUnitAgoFormatParser;
    }

    var ENTimeUnitLaterFormatParser = {};

    var hasRequiredENTimeUnitLaterFormatParser;

    function requireENTimeUnitLaterFormatParser () {
    	if (hasRequiredENTimeUnitLaterFormatParser) return ENTimeUnitLaterFormatParser;
    	hasRequiredENTimeUnitLaterFormatParser = 1;
    	Object.defineProperty(ENTimeUnitLaterFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$9;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const PATTERN = new RegExp(`(${constants_1.TIME_UNITS_PATTERN})\\s{0,5}(?:later|after|from now|henceforth|forward|out)` + "(?=(?:\\W|$))", "i");
    	const STRICT_PATTERN = new RegExp("" + "(" + constants_1.TIME_UNITS_PATTERN + ")" + "(later|from now)" + "(?=(?:\\W|$))", "i");
    	const GROUP_NUM_TIMEUNITS = 1;
    	let ENTimeUnitLaterFormatParser$1 = class ENTimeUnitLaterFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    constructor(strictMode) {
    	        super();
    	        this.strictMode = strictMode;
    	    }
    	    innerPattern() {
    	        return this.strictMode ? STRICT_PATTERN : PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const fragments = constants_1.parseTimeUnits(match[GROUP_NUM_TIMEUNITS]);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, fragments);
    	    }
    	};
    	ENTimeUnitLaterFormatParser.default = ENTimeUnitLaterFormatParser$1;
    	
    	return ENTimeUnitLaterFormatParser;
    }

    var ENMergeDateRangeRefiner$1 = {};

    var AbstractMergeDateRangeRefiner$1 = {};

    var abstractRefiners = {};

    Object.defineProperty(abstractRefiners, "__esModule", { value: true });
    abstractRefiners.MergingRefiner = abstractRefiners.Filter = void 0;
    class Filter {
        refine(context, results) {
            return results.filter((r) => this.isValid(context, r));
        }
    }
    abstractRefiners.Filter = Filter;
    class MergingRefiner {
        refine(context, results) {
            if (results.length < 2) {
                return results;
            }
            const mergedResults = [];
            let curResult = results[0];
            let nextResult = null;
            for (let i = 1; i < results.length; i++) {
                nextResult = results[i];
                const textBetween = context.text.substring(curResult.index + curResult.text.length, nextResult.index);
                if (!this.shouldMergeResults(textBetween, curResult, nextResult, context)) {
                    mergedResults.push(curResult);
                    curResult = nextResult;
                }
                else {
                    const left = curResult;
                    const right = nextResult;
                    const mergedResult = this.mergeResults(textBetween, left, right, context);
                    context.debug(() => {
                        console.log(`${this.constructor.name} merged ${left} and ${right} into ${mergedResult}`);
                    });
                    curResult = mergedResult;
                }
            }
            if (curResult != null) {
                mergedResults.push(curResult);
            }
            return mergedResults;
        }
    }
    abstractRefiners.MergingRefiner = MergingRefiner;

    Object.defineProperty(AbstractMergeDateRangeRefiner$1, "__esModule", { value: true });
    const abstractRefiners_1$2 = abstractRefiners;
    class AbstractMergeDateRangeRefiner extends abstractRefiners_1$2.MergingRefiner {
        shouldMergeResults(textBetween, currentResult, nextResult) {
            return !currentResult.end && !nextResult.end && textBetween.match(this.patternBetween()) != null;
        }
        mergeResults(textBetween, fromResult, toResult) {
            if (!fromResult.start.isOnlyWeekdayComponent() && !toResult.start.isOnlyWeekdayComponent()) {
                toResult.start.getCertainComponents().forEach((key) => {
                    if (!fromResult.start.isCertain(key)) {
                        fromResult.start.assign(key, toResult.start.get(key));
                    }
                });
                fromResult.start.getCertainComponents().forEach((key) => {
                    if (!toResult.start.isCertain(key)) {
                        toResult.start.assign(key, fromResult.start.get(key));
                    }
                });
            }
            if (fromResult.start.date().getTime() > toResult.start.date().getTime()) {
                let fromMoment = fromResult.start.dayjs();
                let toMoment = toResult.start.dayjs();
                if (fromResult.start.isOnlyWeekdayComponent() && fromMoment.add(-7, "days").isBefore(toMoment)) {
                    fromMoment = fromMoment.add(-7, "days");
                    fromResult.start.imply("day", fromMoment.date());
                    fromResult.start.imply("month", fromMoment.month() + 1);
                    fromResult.start.imply("year", fromMoment.year());
                }
                else if (toResult.start.isOnlyWeekdayComponent() && toMoment.add(7, "days").isAfter(fromMoment)) {
                    toMoment = toMoment.add(7, "days");
                    toResult.start.imply("day", toMoment.date());
                    toResult.start.imply("month", toMoment.month() + 1);
                    toResult.start.imply("year", toMoment.year());
                }
                else {
                    [toResult, fromResult] = [fromResult, toResult];
                }
            }
            const result = fromResult.clone();
            result.start = fromResult.start;
            result.end = toResult.start;
            result.index = Math.min(fromResult.index, toResult.index);
            if (fromResult.index < toResult.index) {
                result.text = fromResult.text + textBetween + toResult.text;
            }
            else {
                result.text = toResult.text + textBetween + fromResult.text;
            }
            return result;
        }
    }
    AbstractMergeDateRangeRefiner$1.default = AbstractMergeDateRangeRefiner;

    var __importDefault$m = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ENMergeDateRangeRefiner$1, "__esModule", { value: true });
    const AbstractMergeDateRangeRefiner_1$9 = __importDefault$m(AbstractMergeDateRangeRefiner$1);
    class ENMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$9.default {
        patternBetween() {
            return /^\s*(to|-|–|until|through|till)\s*$/i;
        }
    }
    ENMergeDateRangeRefiner$1.default = ENMergeDateRangeRefiner;

    var ENMergeDateTimeRefiner = {};

    var AbstractMergeDateTimeRefiner = {};

    var mergingCalculation = {};

    var hasRequiredMergingCalculation;

    function requireMergingCalculation () {
    	if (hasRequiredMergingCalculation) return mergingCalculation;
    	hasRequiredMergingCalculation = 1;
    	Object.defineProperty(mergingCalculation, "__esModule", { value: true });
    	mergingCalculation.mergeDateTimeComponent = mergingCalculation.mergeDateTimeResult = void 0;
    	const index_1 = requireDist();
    	const dayjs_1 = requireDayjs();
    	function mergeDateTimeResult(dateResult, timeResult) {
    	    const result = dateResult.clone();
    	    const beginDate = dateResult.start;
    	    const beginTime = timeResult.start;
    	    result.start = mergeDateTimeComponent(beginDate, beginTime);
    	    if (dateResult.end != null || timeResult.end != null) {
    	        const endDate = dateResult.end == null ? dateResult.start : dateResult.end;
    	        const endTime = timeResult.end == null ? timeResult.start : timeResult.end;
    	        const endDateTime = mergeDateTimeComponent(endDate, endTime);
    	        if (dateResult.end == null && endDateTime.date().getTime() < result.start.date().getTime()) {
    	            const nextDayJs = endDateTime.dayjs().add(1, "day");
    	            if (endDateTime.isCertain("day")) {
    	                dayjs_1.assignSimilarDate(endDateTime, nextDayJs);
    	            }
    	            else {
    	                dayjs_1.implySimilarDate(endDateTime, nextDayJs);
    	            }
    	        }
    	        result.end = endDateTime;
    	    }
    	    return result;
    	}
    	mergingCalculation.mergeDateTimeResult = mergeDateTimeResult;
    	function mergeDateTimeComponent(dateComponent, timeComponent) {
    	    const dateTimeComponent = dateComponent.clone();
    	    if (timeComponent.isCertain("hour")) {
    	        dateTimeComponent.assign("hour", timeComponent.get("hour"));
    	        dateTimeComponent.assign("minute", timeComponent.get("minute"));
    	        if (timeComponent.isCertain("second")) {
    	            dateTimeComponent.assign("second", timeComponent.get("second"));
    	            if (timeComponent.isCertain("millisecond")) {
    	                dateTimeComponent.assign("millisecond", timeComponent.get("millisecond"));
    	            }
    	            else {
    	                dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
    	            }
    	        }
    	        else {
    	            dateTimeComponent.imply("second", timeComponent.get("second"));
    	            dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
    	        }
    	    }
    	    else {
    	        dateTimeComponent.imply("hour", timeComponent.get("hour"));
    	        dateTimeComponent.imply("minute", timeComponent.get("minute"));
    	        dateTimeComponent.imply("second", timeComponent.get("second"));
    	        dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
    	    }
    	    if (timeComponent.isCertain("timezoneOffset")) {
    	        dateTimeComponent.assign("timezoneOffset", timeComponent.get("timezoneOffset"));
    	    }
    	    if (timeComponent.isCertain("meridiem")) {
    	        dateTimeComponent.assign("meridiem", timeComponent.get("meridiem"));
    	    }
    	    else if (timeComponent.get("meridiem") != null && dateTimeComponent.get("meridiem") == null) {
    	        dateTimeComponent.imply("meridiem", timeComponent.get("meridiem"));
    	    }
    	    if (dateTimeComponent.get("meridiem") == index_1.Meridiem.PM && dateTimeComponent.get("hour") < 12) {
    	        if (timeComponent.isCertain("hour")) {
    	            dateTimeComponent.assign("hour", dateTimeComponent.get("hour") + 12);
    	        }
    	        else {
    	            dateTimeComponent.imply("hour", dateTimeComponent.get("hour") + 12);
    	        }
    	    }
    	    return dateTimeComponent;
    	}
    	mergingCalculation.mergeDateTimeComponent = mergeDateTimeComponent;
    	
    	return mergingCalculation;
    }

    var hasRequiredAbstractMergeDateTimeRefiner;

    function requireAbstractMergeDateTimeRefiner () {
    	if (hasRequiredAbstractMergeDateTimeRefiner) return AbstractMergeDateTimeRefiner;
    	hasRequiredAbstractMergeDateTimeRefiner = 1;
    	Object.defineProperty(AbstractMergeDateTimeRefiner, "__esModule", { value: true });
    	const abstractRefiners_1 = abstractRefiners;
    	const mergingCalculation_1 = requireMergingCalculation();
    	let AbstractMergeDateTimeRefiner$1 = class AbstractMergeDateTimeRefiner extends abstractRefiners_1.MergingRefiner {
    	    shouldMergeResults(textBetween, currentResult, nextResult) {
    	        return (((currentResult.start.isOnlyDate() && nextResult.start.isOnlyTime()) ||
    	            (nextResult.start.isOnlyDate() && currentResult.start.isOnlyTime())) &&
    	            textBetween.match(this.patternBetween()) != null);
    	    }
    	    mergeResults(textBetween, currentResult, nextResult) {
    	        const result = currentResult.start.isOnlyDate()
    	            ? mergingCalculation_1.mergeDateTimeResult(currentResult, nextResult)
    	            : mergingCalculation_1.mergeDateTimeResult(nextResult, currentResult);
    	        result.index = currentResult.index;
    	        result.text = currentResult.text + textBetween + nextResult.text;
    	        return result;
    	    }
    	};
    	AbstractMergeDateTimeRefiner.default = AbstractMergeDateTimeRefiner$1;
    	
    	return AbstractMergeDateTimeRefiner;
    }

    var hasRequiredENMergeDateTimeRefiner;

    function requireENMergeDateTimeRefiner () {
    	if (hasRequiredENMergeDateTimeRefiner) return ENMergeDateTimeRefiner;
    	hasRequiredENMergeDateTimeRefiner = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(ENMergeDateTimeRefiner, "__esModule", { value: true });
    	const AbstractMergeDateTimeRefiner_1 = __importDefault(requireAbstractMergeDateTimeRefiner());
    	let ENMergeDateTimeRefiner$1 = class ENMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    	    patternBetween() {
    	        return new RegExp("^\\s*(T|at|after|before|on|of|,|-)?\\s*$");
    	    }
    	};
    	ENMergeDateTimeRefiner.default = ENMergeDateTimeRefiner$1;
    	
    	return ENMergeDateTimeRefiner;
    }

    var configurations = {};

    var ExtractTimezoneAbbrRefiner$1 = {};

    Object.defineProperty(ExtractTimezoneAbbrRefiner$1, "__esModule", { value: true });
    const TIMEZONE_NAME_PATTERN = new RegExp("^\\s*,?\\s*\\(?([A-Z]{2,4})\\)?(?=\\W|$)", "i");
    const DEFAULT_TIMEZONE_ABBR_MAP = {
        ACDT: 630,
        ACST: 570,
        ADT: -180,
        AEDT: 660,
        AEST: 600,
        AFT: 270,
        AKDT: -480,
        AKST: -540,
        ALMT: 360,
        AMST: -180,
        AMT: -240,
        ANAST: 720,
        ANAT: 720,
        AQTT: 300,
        ART: -180,
        AST: -240,
        AWDT: 540,
        AWST: 480,
        AZOST: 0,
        AZOT: -60,
        AZST: 300,
        AZT: 240,
        BNT: 480,
        BOT: -240,
        BRST: -120,
        BRT: -180,
        BST: 60,
        BTT: 360,
        CAST: 480,
        CAT: 120,
        CCT: 390,
        CDT: -300,
        CEST: 120,
        CET: 60,
        CHADT: 825,
        CHAST: 765,
        CKT: -600,
        CLST: -180,
        CLT: -240,
        COT: -300,
        CST: -360,
        CVT: -60,
        CXT: 420,
        ChST: 600,
        DAVT: 420,
        EASST: -300,
        EAST: -360,
        EAT: 180,
        ECT: -300,
        EDT: -240,
        EEST: 180,
        EET: 120,
        EGST: 0,
        EGT: -60,
        EST: -300,
        ET: -300,
        FJST: 780,
        FJT: 720,
        FKST: -180,
        FKT: -240,
        FNT: -120,
        GALT: -360,
        GAMT: -540,
        GET: 240,
        GFT: -180,
        GILT: 720,
        GMT: 0,
        GST: 240,
        GYT: -240,
        HAA: -180,
        HAC: -300,
        HADT: -540,
        HAE: -240,
        HAP: -420,
        HAR: -360,
        HAST: -600,
        HAT: -90,
        HAY: -480,
        HKT: 480,
        HLV: -210,
        HNA: -240,
        HNC: -360,
        HNE: -300,
        HNP: -480,
        HNR: -420,
        HNT: -150,
        HNY: -540,
        HOVT: 420,
        ICT: 420,
        IDT: 180,
        IOT: 360,
        IRDT: 270,
        IRKST: 540,
        IRKT: 540,
        IRST: 210,
        IST: 330,
        JST: 540,
        KGT: 360,
        KRAST: 480,
        KRAT: 480,
        KST: 540,
        KUYT: 240,
        LHDT: 660,
        LHST: 630,
        LINT: 840,
        MAGST: 720,
        MAGT: 720,
        MART: -510,
        MAWT: 300,
        MDT: -360,
        MESZ: 120,
        MEZ: 60,
        MHT: 720,
        MMT: 390,
        MSD: 240,
        MSK: 240,
        MST: -420,
        MUT: 240,
        MVT: 300,
        MYT: 480,
        NCT: 660,
        NDT: -90,
        NFT: 690,
        NOVST: 420,
        NOVT: 360,
        NPT: 345,
        NST: -150,
        NUT: -660,
        NZDT: 780,
        NZST: 720,
        OMSST: 420,
        OMST: 420,
        PDT: -420,
        PET: -300,
        PETST: 720,
        PETT: 720,
        PGT: 600,
        PHOT: 780,
        PHT: 480,
        PKT: 300,
        PMDT: -120,
        PMST: -180,
        PONT: 660,
        PST: -480,
        PT: -480,
        PWT: 540,
        PYST: -180,
        PYT: -240,
        RET: 240,
        SAMT: 240,
        SAST: 120,
        SBT: 660,
        SCT: 240,
        SGT: 480,
        SRT: -180,
        SST: -660,
        TAHT: -600,
        TFT: 300,
        TJT: 300,
        TKT: 780,
        TLT: 540,
        TMT: 300,
        TVT: 720,
        ULAT: 480,
        UTC: 0,
        UYST: -120,
        UYT: -180,
        UZT: 300,
        VET: -210,
        VLAST: 660,
        VLAT: 660,
        VUT: 660,
        WAST: 120,
        WAT: 60,
        WEST: 60,
        WESZ: 60,
        WET: 0,
        WEZ: 0,
        WFT: 720,
        WGST: -120,
        WGT: -180,
        WIB: 420,
        WIT: 540,
        WITA: 480,
        WST: 780,
        WT: 0,
        YAKST: 600,
        YAKT: 600,
        YAPT: 600,
        YEKST: 360,
        YEKT: 360,
    };
    class ExtractTimezoneAbbrRefiner {
        constructor(timezoneOverrides) {
            this.timezone = Object.assign(Object.assign({}, DEFAULT_TIMEZONE_ABBR_MAP), timezoneOverrides);
        }
        refine(context, results) {
            var _a;
            const timezoneOverrides = (_a = context.option.timezones) !== null && _a !== void 0 ? _a : {};
            results.forEach((result) => {
                var _a, _b;
                const suffix = context.text.substring(result.index + result.text.length);
                const match = TIMEZONE_NAME_PATTERN.exec(suffix);
                if (!match) {
                    return;
                }
                const timezoneAbbr = match[1].toUpperCase();
                const extractedTimezoneOffset = (_b = (_a = timezoneOverrides[timezoneAbbr]) !== null && _a !== void 0 ? _a : this.timezone[timezoneAbbr]) !== null && _b !== void 0 ? _b : null;
                if (extractedTimezoneOffset === null) {
                    return;
                }
                context.debug(() => {
                    console.log(`Extracting timezone: '${timezoneAbbr}' into: ${extractedTimezoneOffset} for: ${result.start}`);
                });
                const currentTimezoneOffset = result.start.get("timezoneOffset");
                if (currentTimezoneOffset !== null && extractedTimezoneOffset != currentTimezoneOffset) {
                    if (result.start.isCertain("timezoneOffset")) {
                        return;
                    }
                    if (timezoneAbbr != match[1]) {
                        return;
                    }
                }
                if (result.start.isOnlyDate()) {
                    if (timezoneAbbr != match[1]) {
                        return;
                    }
                }
                result.text += match[0];
                if (!result.start.isCertain("timezoneOffset")) {
                    result.start.assign("timezoneOffset", extractedTimezoneOffset);
                }
                if (result.end != null && !result.end.isCertain("timezoneOffset")) {
                    result.end.assign("timezoneOffset", extractedTimezoneOffset);
                }
            });
            return results;
        }
    }
    ExtractTimezoneAbbrRefiner$1.default = ExtractTimezoneAbbrRefiner;

    var ExtractTimezoneOffsetRefiner$1 = {};

    Object.defineProperty(ExtractTimezoneOffsetRefiner$1, "__esModule", { value: true });
    const TIMEZONE_OFFSET_PATTERN = new RegExp("^\\s*(?:\\(?(?:GMT|UTC)\\s?)?([+-])(\\d{1,2})(?::?(\\d{2}))?\\)?", "i");
    const TIMEZONE_OFFSET_SIGN_GROUP = 1;
    const TIMEZONE_OFFSET_HOUR_OFFSET_GROUP = 2;
    const TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP = 3;
    class ExtractTimezoneOffsetRefiner {
        refine(context, results) {
            results.forEach(function (result) {
                if (result.start.isCertain("timezoneOffset")) {
                    return;
                }
                const suffix = context.text.substring(result.index + result.text.length);
                const match = TIMEZONE_OFFSET_PATTERN.exec(suffix);
                if (!match) {
                    return;
                }
                context.debug(() => {
                    console.log(`Extracting timezone: '${match[0]}' into : ${result}`);
                });
                const hourOffset = parseInt(match[TIMEZONE_OFFSET_HOUR_OFFSET_GROUP]);
                const minuteOffset = parseInt(match[TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP] || "0");
                let timezoneOffset = hourOffset * 60 + minuteOffset;
                if (timezoneOffset > 14 * 60) {
                    return;
                }
                if (match[TIMEZONE_OFFSET_SIGN_GROUP] === "-") {
                    timezoneOffset = -timezoneOffset;
                }
                if (result.end != null) {
                    result.end.assign("timezoneOffset", timezoneOffset);
                }
                result.start.assign("timezoneOffset", timezoneOffset);
                result.text += match[0];
            });
            return results;
        }
    }
    ExtractTimezoneOffsetRefiner$1.default = ExtractTimezoneOffsetRefiner;

    var OverlapRemovalRefiner$1 = {};

    Object.defineProperty(OverlapRemovalRefiner$1, "__esModule", { value: true });
    class OverlapRemovalRefiner {
        refine(context, results) {
            if (results.length < 2) {
                return results;
            }
            const filteredResults = [];
            let prevResult = results[0];
            for (let i = 1; i < results.length; i++) {
                const result = results[i];
                if (result.index < prevResult.index + prevResult.text.length) {
                    if (result.text.length > prevResult.text.length) {
                        prevResult = result;
                    }
                }
                else {
                    filteredResults.push(prevResult);
                    prevResult = result;
                }
            }
            if (prevResult != null) {
                filteredResults.push(prevResult);
            }
            return filteredResults;
        }
    }
    OverlapRemovalRefiner$1.default = OverlapRemovalRefiner;

    var ForwardDateRefiner = {};

    var hasRequiredForwardDateRefiner;

    function requireForwardDateRefiner () {
    	if (hasRequiredForwardDateRefiner) return ForwardDateRefiner;
    	hasRequiredForwardDateRefiner = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(ForwardDateRefiner, "__esModule", { value: true });
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const dayjs_2 = requireDayjs();
    	let ForwardDateRefiner$1 = class ForwardDateRefiner {
    	    refine(context, results) {
    	        if (!context.option.forwardDate) {
    	            return results;
    	        }
    	        results.forEach(function (result) {
    	            let refMoment = dayjs_1.default(context.refDate);
    	            if (result.start.isOnlyTime() && refMoment.isAfter(result.start.dayjs())) {
    	                refMoment = refMoment.add(1, "day");
    	                dayjs_2.implySimilarDate(result.start, refMoment);
    	                if (result.end && result.end.isOnlyTime()) {
    	                    dayjs_2.implySimilarDate(result.end, refMoment);
    	                    if (result.start.dayjs().isAfter(result.end.dayjs())) {
    	                        refMoment = refMoment.add(1, "day");
    	                        dayjs_2.implySimilarDate(result.end, refMoment);
    	                    }
    	                }
    	            }
    	            if (result.start.isOnlyDayMonthComponent() && refMoment.isAfter(result.start.dayjs())) {
    	                for (let i = 0; i < 3 && refMoment.isAfter(result.start.dayjs()); i++) {
    	                    result.start.imply("year", result.start.get("year") + 1);
    	                    context.debug(() => {
    	                        console.log(`Forward yearly adjusted for ${result} (${result.start})`);
    	                    });
    	                    if (result.end && !result.end.isCertain("year")) {
    	                        result.end.imply("year", result.end.get("year") + 1);
    	                        context.debug(() => {
    	                            console.log(`Forward yearly adjusted for ${result} (${result.end})`);
    	                        });
    	                    }
    	                }
    	            }
    	            if (result.start.isOnlyWeekdayComponent() && refMoment.isAfter(result.start.dayjs())) {
    	                if (refMoment.day() >= result.start.get("weekday")) {
    	                    refMoment = refMoment.day(result.start.get("weekday") + 7);
    	                }
    	                else {
    	                    refMoment = refMoment.day(result.start.get("weekday"));
    	                }
    	                result.start.imply("day", refMoment.date());
    	                result.start.imply("month", refMoment.month() + 1);
    	                result.start.imply("year", refMoment.year());
    	                context.debug(() => {
    	                    console.log(`Forward weekly adjusted for ${result} (${result.start})`);
    	                });
    	                if (result.end && result.end.isOnlyWeekdayComponent()) {
    	                    if (refMoment.day() > result.end.get("weekday")) {
    	                        refMoment = refMoment.day(result.end.get("weekday") + 7);
    	                    }
    	                    else {
    	                        refMoment = refMoment.day(result.end.get("weekday"));
    	                    }
    	                    result.end.imply("day", refMoment.date());
    	                    result.end.imply("month", refMoment.month() + 1);
    	                    result.end.imply("year", refMoment.year());
    	                    context.debug(() => {
    	                        console.log(`Forward weekly adjusted for ${result} (${result.end})`);
    	                    });
    	                }
    	            }
    	        });
    	        return results;
    	    }
    	};
    	ForwardDateRefiner.default = ForwardDateRefiner$1;
    	
    	return ForwardDateRefiner;
    }

    var UnlikelyFormatFilter$1 = {};

    Object.defineProperty(UnlikelyFormatFilter$1, "__esModule", { value: true });
    const abstractRefiners_1$1 = abstractRefiners;
    class UnlikelyFormatFilter extends abstractRefiners_1$1.Filter {
        constructor(strictMode) {
            super();
            this.strictMode = strictMode;
        }
        isValid(context, result) {
            if (result.text.replace(" ", "").match(/^\d*(\.\d*)?$/)) {
                context.debug(() => {
                    console.log(`Removing unlikely result '${result.text}'`);
                });
                return false;
            }
            if (!result.start.isValidDate()) {
                context.debug(() => {
                    console.log(`Removing invalid result: ${result} (${result.start})`);
                });
                return false;
            }
            if (result.end && !result.end.isValidDate()) {
                context.debug(() => {
                    console.log(`Removing invalid result: ${result} (${result.end})`);
                });
                return false;
            }
            if (this.strictMode) {
                return this.isStrictModeValid(context, result);
            }
            return true;
        }
        isStrictModeValid(context, result) {
            if (result.start.isOnlyWeekdayComponent()) {
                context.debug(() => {
                    console.log(`(Strict) Removing weekday only component: ${result} (${result.end})`);
                });
                return false;
            }
            if (result.start.isOnlyTime() && (!result.start.isCertain("hour") || !result.start.isCertain("minute"))) {
                context.debug(() => {
                    console.log(`(Strict) Removing uncertain time component: ${result} (${result.end})`);
                });
                return false;
            }
            return true;
        }
    }
    UnlikelyFormatFilter$1.default = UnlikelyFormatFilter;

    var ISOFormatParser$1 = {};

    Object.defineProperty(ISOFormatParser$1, "__esModule", { value: true });
    const AbstractParserWithWordBoundary_1$m = AbstractParserWithWordBoundary;
    const PATTERN$i = new RegExp("([0-9]{4})\\-([0-9]{1,2})\\-([0-9]{1,2})" +
        "(?:T" +
        "([0-9]{1,2}):([0-9]{1,2})" +
        "(?:" +
        ":([0-9]{1,2})(?:\\.(\\d{1,4}))?" +
        ")?" +
        "(?:" +
        "Z|([+-]\\d{2}):?(\\d{2})?" +
        ")?" +
        ")?" +
        "(?=\\W|$)", "i");
    const YEAR_NUMBER_GROUP$2 = 1;
    const MONTH_NUMBER_GROUP$1 = 2;
    const DATE_NUMBER_GROUP$1 = 3;
    const HOUR_NUMBER_GROUP = 4;
    const MINUTE_NUMBER_GROUP = 5;
    const SECOND_NUMBER_GROUP = 6;
    const MILLISECOND_NUMBER_GROUP = 7;
    const TZD_HOUR_OFFSET_GROUP = 8;
    const TZD_MINUTE_OFFSET_GROUP = 9;
    class ISOFormatParser extends AbstractParserWithWordBoundary_1$m.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$i;
        }
        innerExtract(context, match) {
            const components = {};
            components["year"] = parseInt(match[YEAR_NUMBER_GROUP$2]);
            components["month"] = parseInt(match[MONTH_NUMBER_GROUP$1]);
            components["day"] = parseInt(match[DATE_NUMBER_GROUP$1]);
            if (match[HOUR_NUMBER_GROUP] != null) {
                components["hour"] = parseInt(match[HOUR_NUMBER_GROUP]);
                components["minute"] = parseInt(match[MINUTE_NUMBER_GROUP]);
                if (match[SECOND_NUMBER_GROUP] != null) {
                    components["second"] = parseInt(match[SECOND_NUMBER_GROUP]);
                }
                if (match[MILLISECOND_NUMBER_GROUP] != null) {
                    components["millisecond"] = parseInt(match[MILLISECOND_NUMBER_GROUP]);
                }
                if (match[TZD_HOUR_OFFSET_GROUP] == null) {
                    components["timezoneOffset"] = 0;
                }
                else {
                    const hourOffset = parseInt(match[TZD_HOUR_OFFSET_GROUP]);
                    let minuteOffset = 0;
                    if (match[TZD_MINUTE_OFFSET_GROUP] != null) {
                        minuteOffset = parseInt(match[TZD_MINUTE_OFFSET_GROUP]);
                    }
                    let offset = hourOffset * 60;
                    if (offset < 0) {
                        offset -= minuteOffset;
                    }
                    else {
                        offset += minuteOffset;
                    }
                    components["timezoneOffset"] = offset;
                }
            }
            return components;
        }
    }
    ISOFormatParser$1.default = ISOFormatParser;

    var MergeWeekdayComponentRefiner$1 = {};

    Object.defineProperty(MergeWeekdayComponentRefiner$1, "__esModule", { value: true });
    const abstractRefiners_1 = abstractRefiners;
    class MergeWeekdayComponentRefiner extends abstractRefiners_1.MergingRefiner {
        mergeResults(textBetween, currentResult, nextResult) {
            const newResult = nextResult.clone();
            newResult.index = currentResult.index;
            newResult.text = currentResult.text + textBetween + newResult.text;
            newResult.start.assign("weekday", currentResult.start.get("weekday"));
            if (newResult.end) {
                newResult.end.assign("weekday", currentResult.start.get("weekday"));
            }
            return newResult;
        }
        shouldMergeResults(textBetween, currentResult, nextResult) {
            const weekdayThenNormalDate = currentResult.start.isOnlyWeekdayComponent() &&
                !currentResult.start.isCertain("hour") &&
                nextResult.start.isCertain("day");
            return weekdayThenNormalDate && textBetween.match(/^,?\s*$/) != null;
        }
    }
    MergeWeekdayComponentRefiner$1.default = MergeWeekdayComponentRefiner;

    var hasRequiredConfigurations;

    function requireConfigurations () {
    	if (hasRequiredConfigurations) return configurations;
    	hasRequiredConfigurations = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(configurations, "__esModule", { value: true });
    	configurations.includeCommonConfiguration = void 0;
    	const ExtractTimezoneAbbrRefiner_1 = __importDefault(ExtractTimezoneAbbrRefiner$1);
    	const ExtractTimezoneOffsetRefiner_1 = __importDefault(ExtractTimezoneOffsetRefiner$1);
    	const OverlapRemovalRefiner_1 = __importDefault(OverlapRemovalRefiner$1);
    	const ForwardDateRefiner_1 = __importDefault(requireForwardDateRefiner());
    	const UnlikelyFormatFilter_1 = __importDefault(UnlikelyFormatFilter$1);
    	const ISOFormatParser_1 = __importDefault(ISOFormatParser$1);
    	const MergeWeekdayComponentRefiner_1 = __importDefault(MergeWeekdayComponentRefiner$1);
    	function includeCommonConfiguration(configuration, strictMode = false) {
    	    configuration.parsers.unshift(new ISOFormatParser_1.default());
    	    configuration.refiners.unshift(new MergeWeekdayComponentRefiner_1.default());
    	    configuration.refiners.unshift(new ExtractTimezoneAbbrRefiner_1.default());
    	    configuration.refiners.unshift(new ExtractTimezoneOffsetRefiner_1.default());
    	    configuration.refiners.unshift(new OverlapRemovalRefiner_1.default());
    	    configuration.refiners.push(new OverlapRemovalRefiner_1.default());
    	    configuration.refiners.push(new ForwardDateRefiner_1.default());
    	    configuration.refiners.push(new UnlikelyFormatFilter_1.default(strictMode));
    	    return configuration;
    	}
    	configurations.includeCommonConfiguration = includeCommonConfiguration;
    	
    	return configurations;
    }

    var ENCasualDateParser = {};

    var casualReferences = {};

    var hasRequiredCasualReferences;

    function requireCasualReferences () {
    	if (hasRequiredCasualReferences) return casualReferences;
    	hasRequiredCasualReferences = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(casualReferences, "__esModule", { value: true });
    	casualReferences.noon = casualReferences.afternoon = casualReferences.morning = casualReferences.midnight = casualReferences.yesterdayEvening = casualReferences.evening = casualReferences.lastNight = casualReferences.tonight = casualReferences.theDayAfter = casualReferences.tomorrow = casualReferences.theDayBefore = casualReferences.yesterday = casualReferences.today = casualReferences.now = void 0;
    	const results_1 = requireResults();
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const dayjs_2 = requireDayjs();
    	const index_1 = requireDist();
    	function now(reference) {
    	    const targetDate = dayjs_1.default(reference.instant);
    	    const component = new results_1.ParsingComponents(reference, {});
    	    dayjs_2.assignSimilarDate(component, targetDate);
    	    dayjs_2.assignSimilarTime(component, targetDate);
    	    if (reference.timezoneOffset !== null) {
    	        component.assign("timezoneOffset", targetDate.utcOffset());
    	    }
    	    return component;
    	}
    	casualReferences.now = now;
    	function today(reference) {
    	    const targetDate = dayjs_1.default(reference.instant);
    	    const component = new results_1.ParsingComponents(reference, {});
    	    dayjs_2.assignSimilarDate(component, targetDate);
    	    dayjs_2.implySimilarTime(component, targetDate);
    	    return component;
    	}
    	casualReferences.today = today;
    	function yesterday(reference) {
    	    return theDayBefore(reference, 1);
    	}
    	casualReferences.yesterday = yesterday;
    	function theDayBefore(reference, numDay) {
    	    return theDayAfter(reference, -numDay);
    	}
    	casualReferences.theDayBefore = theDayBefore;
    	function tomorrow(reference) {
    	    return theDayAfter(reference, 1);
    	}
    	casualReferences.tomorrow = tomorrow;
    	function theDayAfter(reference, nDays) {
    	    let targetDate = dayjs_1.default(reference.instant);
    	    const component = new results_1.ParsingComponents(reference, {});
    	    targetDate = targetDate.add(nDays, "day");
    	    dayjs_2.assignSimilarDate(component, targetDate);
    	    dayjs_2.implySimilarTime(component, targetDate);
    	    return component;
    	}
    	casualReferences.theDayAfter = theDayAfter;
    	function tonight(reference, implyHour = 22) {
    	    const targetDate = dayjs_1.default(reference.instant);
    	    const component = new results_1.ParsingComponents(reference, {});
    	    component.imply("hour", implyHour);
    	    component.imply("meridiem", index_1.Meridiem.PM);
    	    dayjs_2.assignSimilarDate(component, targetDate);
    	    return component;
    	}
    	casualReferences.tonight = tonight;
    	function lastNight(reference, implyHour = 0) {
    	    let targetDate = dayjs_1.default(reference.instant);
    	    const component = new results_1.ParsingComponents(reference, {});
    	    if (targetDate.hour() < 6) {
    	        targetDate = targetDate.add(-1, "day");
    	    }
    	    dayjs_2.assignSimilarDate(component, targetDate);
    	    component.imply("hour", implyHour);
    	    return component;
    	}
    	casualReferences.lastNight = lastNight;
    	function evening(reference, implyHour = 20) {
    	    const component = new results_1.ParsingComponents(reference, {});
    	    component.imply("meridiem", index_1.Meridiem.PM);
    	    component.imply("hour", implyHour);
    	    return component;
    	}
    	casualReferences.evening = evening;
    	function yesterdayEvening(reference, implyHour = 20) {
    	    let targetDate = dayjs_1.default(reference.instant);
    	    const component = new results_1.ParsingComponents(reference, {});
    	    targetDate = targetDate.add(-1, "day");
    	    dayjs_2.assignSimilarDate(component, targetDate);
    	    component.imply("hour", implyHour);
    	    component.imply("meridiem", index_1.Meridiem.PM);
    	    return component;
    	}
    	casualReferences.yesterdayEvening = yesterdayEvening;
    	function midnight(reference) {
    	    const component = new results_1.ParsingComponents(reference, {});
    	    const targetDate = dayjs_1.default(reference.instant);
    	    if (targetDate.hour() > 2) {
    	        dayjs_2.implyTheNextDay(component, targetDate);
    	    }
    	    component.assign("hour", 0);
    	    component.imply("minute", 0);
    	    component.imply("second", 0);
    	    component.imply("millisecond", 0);
    	    return component;
    	}
    	casualReferences.midnight = midnight;
    	function morning(reference, implyHour = 6) {
    	    const component = new results_1.ParsingComponents(reference, {});
    	    component.imply("meridiem", index_1.Meridiem.AM);
    	    component.imply("hour", implyHour);
    	    component.imply("minute", 0);
    	    component.imply("second", 0);
    	    component.imply("millisecond", 0);
    	    return component;
    	}
    	casualReferences.morning = morning;
    	function afternoon(reference, implyHour = 15) {
    	    const component = new results_1.ParsingComponents(reference, {});
    	    component.imply("meridiem", index_1.Meridiem.PM);
    	    component.imply("hour", implyHour);
    	    component.imply("minute", 0);
    	    component.imply("second", 0);
    	    component.imply("millisecond", 0);
    	    return component;
    	}
    	casualReferences.afternoon = afternoon;
    	function noon(reference) {
    	    const component = new results_1.ParsingComponents(reference, {});
    	    component.imply("meridiem", index_1.Meridiem.AM);
    	    component.imply("hour", 12);
    	    component.imply("minute", 0);
    	    component.imply("second", 0);
    	    component.imply("millisecond", 0);
    	    return component;
    	}
    	casualReferences.noon = noon;
    	
    	return casualReferences;
    }

    var hasRequiredENCasualDateParser;

    function requireENCasualDateParser () {
    	if (hasRequiredENCasualDateParser) return ENCasualDateParser;
    	hasRequiredENCasualDateParser = 1;
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(ENCasualDateParser, "__esModule", { value: true });
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const dayjs_2 = requireDayjs();
    	const references = __importStar(requireCasualReferences());
    	const PATTERN = /(now|today|tonight|tomorrow|tmr|tmrw|yesterday|last\s*night|(?<!\d\s*)day\s*after\s*tomorrow|(?<!\d\s*)day\s*before\s*yesterday)(?=\W|$)/i;
    	let ENCasualDateParser$1 = class ENCasualDateParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern(context) {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        let targetDate = dayjs_1.default(context.refDate);
    	        const lowerText = match[0].toLowerCase();
    	        const component = context.createParsingComponents();
    	        switch (lowerText) {
    	            case "now":
    	                return references.now(context.reference);
    	            case "today":
    	                return references.today(context.reference);
    	            case "yesterday":
    	                return references.yesterday(context.reference);
    	            case "tomorrow":
    	            case "tmr":
    	            case "tmrw":
    	                return references.tomorrow(context.reference);
    	            case "tonight":
    	                return references.tonight(context.reference);
    	            default:
    	                if (lowerText.match(/last\s*night/)) {
    	                    if (targetDate.hour() > 6) {
    	                        targetDate = targetDate.add(-1, "day");
    	                    }
    	                    dayjs_2.assignSimilarDate(component, targetDate);
    	                    component.imply("hour", 0);
    	                }
    	                if (lowerText.match(/after\s*tomorrow/)) {
    	                    return references.theDayAfter(context.reference, 2);
    	                }
    	                if (lowerText.match(/before\s*yesterday/)) {
    	                    return references.theDayBefore(context.reference, 2);
    	                }
    	                break;
    	        }
    	        return component;
    	    }
    	};
    	ENCasualDateParser.default = ENCasualDateParser$1;
    	
    	return ENCasualDateParser;
    }

    var ENCasualTimeParser = {};

    var hasRequiredENCasualTimeParser;

    function requireENCasualTimeParser () {
    	if (hasRequiredENCasualTimeParser) return ENCasualTimeParser;
    	hasRequiredENCasualTimeParser = 1;
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	Object.defineProperty(ENCasualTimeParser, "__esModule", { value: true });
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const casualReferences = __importStar(requireCasualReferences());
    	const PATTERN = /(?:this)?\s{0,3}(morning|afternoon|evening|night|midnight|midday|noon)(?=\W|$)/i;
    	let ENCasualTimeParser$1 = class ENCasualTimeParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        switch (match[1].toLowerCase()) {
    	            case "afternoon":
    	                return casualReferences.afternoon(context.reference);
    	            case "evening":
    	            case "night":
    	                return casualReferences.evening(context.reference);
    	            case "midnight":
    	                return casualReferences.midnight(context.reference);
    	            case "morning":
    	                return casualReferences.morning(context.reference);
    	            case "noon":
    	            case "midday":
    	                return casualReferences.noon(context.reference);
    	        }
    	        return null;
    	    }
    	};
    	ENCasualTimeParser.default = ENCasualTimeParser$1;
    	
    	return ENCasualTimeParser;
    }

    var ENWeekdayParser = {};

    var weekdays = {};

    var hasRequiredWeekdays;

    function requireWeekdays () {
    	if (hasRequiredWeekdays) return weekdays;
    	hasRequiredWeekdays = 1;
    	Object.defineProperty(weekdays, "__esModule", { value: true });
    	weekdays.getBackwardDaysToWeekday = weekdays.getDaysForwardToWeekday = weekdays.getDaysToWeekdayClosest = weekdays.getDaysToWeekday = weekdays.createParsingComponentsAtWeekday = void 0;
    	const index_1 = requireDist();
    	const results_1 = requireResults();
    	const timeunits_1 = timeunits;
    	function createParsingComponentsAtWeekday(reference, weekday, modifier) {
    	    const refDate = reference.getDateWithAdjustedTimezone();
    	    const daysToWeekday = getDaysToWeekday(refDate, weekday, modifier);
    	    let components = new results_1.ParsingComponents(reference);
    	    components = timeunits_1.addImpliedTimeUnits(components, { "day": daysToWeekday });
    	    components.assign("weekday", weekday);
    	    return components;
    	}
    	weekdays.createParsingComponentsAtWeekday = createParsingComponentsAtWeekday;
    	function getDaysToWeekday(refDate, weekday, modifier) {
    	    const refWeekday = refDate.getDay();
    	    switch (modifier) {
    	        case "this":
    	            return getDaysForwardToWeekday(refDate, weekday);
    	        case "last":
    	            return getBackwardDaysToWeekday(refDate, weekday);
    	        case "next":
    	            if (refWeekday == index_1.Weekday.SUNDAY) {
    	                return weekday == index_1.Weekday.SUNDAY ? 7 : weekday;
    	            }
    	            if (refWeekday == index_1.Weekday.SATURDAY) {
    	                if (weekday == index_1.Weekday.SATURDAY)
    	                    return 7;
    	                if (weekday == index_1.Weekday.SUNDAY)
    	                    return 8;
    	                return 1 + weekday;
    	            }
    	            if (weekday < refWeekday && weekday != index_1.Weekday.SUNDAY) {
    	                return getDaysForwardToWeekday(refDate, weekday);
    	            }
    	            else {
    	                return getDaysForwardToWeekday(refDate, weekday) + 7;
    	            }
    	    }
    	    return getDaysToWeekdayClosest(refDate, weekday);
    	}
    	weekdays.getDaysToWeekday = getDaysToWeekday;
    	function getDaysToWeekdayClosest(refDate, weekday) {
    	    const backward = getBackwardDaysToWeekday(refDate, weekday);
    	    const forward = getDaysForwardToWeekday(refDate, weekday);
    	    return forward < -backward ? forward : backward;
    	}
    	weekdays.getDaysToWeekdayClosest = getDaysToWeekdayClosest;
    	function getDaysForwardToWeekday(refDate, weekday) {
    	    const refWeekday = refDate.getDay();
    	    let forwardCount = weekday - refWeekday;
    	    if (forwardCount < 0) {
    	        forwardCount += 7;
    	    }
    	    return forwardCount;
    	}
    	weekdays.getDaysForwardToWeekday = getDaysForwardToWeekday;
    	function getBackwardDaysToWeekday(refDate, weekday) {
    	    const refWeekday = refDate.getDay();
    	    let backwardCount = weekday - refWeekday;
    	    if (backwardCount >= 0) {
    	        backwardCount -= 7;
    	    }
    	    return backwardCount;
    	}
    	weekdays.getBackwardDaysToWeekday = getBackwardDaysToWeekday;
    	
    	return weekdays;
    }

    var hasRequiredENWeekdayParser;

    function requireENWeekdayParser () {
    	if (hasRequiredENWeekdayParser) return ENWeekdayParser;
    	hasRequiredENWeekdayParser = 1;
    	Object.defineProperty(ENWeekdayParser, "__esModule", { value: true });
    	const constants_1 = constants$9;
    	const pattern_1 = pattern;
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const weekdays_1 = requireWeekdays();
    	const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    	    "(?:on\\s*?)?" +
    	    "(?:(this|last|past|next)\\s*)?" +
    	    `(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})` +
    	    "(?:\\s*(?:\\,|\\)|\\）))?" +
    	    "(?:\\s*(this|last|past|next)\\s*week)?" +
    	    "(?=\\W|$)", "i");
    	const PREFIX_GROUP = 1;
    	const WEEKDAY_GROUP = 2;
    	const POSTFIX_GROUP = 3;
    	let ENWeekdayParser$1 = class ENWeekdayParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
    	        const weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
    	        const prefix = match[PREFIX_GROUP];
    	        const postfix = match[POSTFIX_GROUP];
    	        let modifierWord = prefix || postfix;
    	        modifierWord = modifierWord || "";
    	        modifierWord = modifierWord.toLowerCase();
    	        let modifier = null;
    	        if (modifierWord == "last" || modifierWord == "past") {
    	            modifier = "last";
    	        }
    	        else if (modifierWord == "next") {
    	            modifier = "next";
    	        }
    	        else if (modifierWord == "this") {
    	            modifier = "this";
    	        }
    	        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    	    }
    	};
    	ENWeekdayParser.default = ENWeekdayParser$1;
    	
    	return ENWeekdayParser;
    }

    var ENRelativeDateFormatParser = {};

    var hasRequiredENRelativeDateFormatParser;

    function requireENRelativeDateFormatParser () {
    	if (hasRequiredENRelativeDateFormatParser) return ENRelativeDateFormatParser;
    	hasRequiredENRelativeDateFormatParser = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(ENRelativeDateFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$9;
    	const results_1 = requireResults();
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const pattern_1 = pattern;
    	const PATTERN = new RegExp(`(this|last|past|next|after\\s*this)\\s*(${pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY)})(?=\\s*)` + "(?=\\W|$)", "i");
    	const MODIFIER_WORD_GROUP = 1;
    	const RELATIVE_WORD_GROUP = 2;
    	let ENRelativeDateFormatParser$1 = class ENRelativeDateFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
    	        const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
    	        const timeunit = constants_1.TIME_UNIT_DICTIONARY[unitWord];
    	        if (modifier == "next" || modifier.startsWith("after")) {
    	            const timeUnits = {};
    	            timeUnits[timeunit] = 1;
    	            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	        }
    	        if (modifier == "last" || modifier == "past") {
    	            const timeUnits = {};
    	            timeUnits[timeunit] = -1;
    	            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	        }
    	        const components = context.createParsingComponents();
    	        let date = dayjs_1.default(context.reference.instant);
    	        if (unitWord.match(/week/i)) {
    	            date = date.add(-date.get("d"), "d");
    	            components.imply("day", date.date());
    	            components.imply("month", date.month() + 1);
    	            components.imply("year", date.year());
    	        }
    	        else if (unitWord.match(/month/i)) {
    	            date = date.add(-date.date() + 1, "d");
    	            components.imply("day", date.date());
    	            components.assign("year", date.year());
    	            components.assign("month", date.month() + 1);
    	        }
    	        else if (unitWord.match(/year/i)) {
    	            date = date.add(-date.date() + 1, "d");
    	            date = date.add(-date.month(), "month");
    	            components.imply("day", date.date());
    	            components.imply("month", date.month() + 1);
    	            components.assign("year", date.year());
    	        }
    	        return components;
    	    }
    	};
    	ENRelativeDateFormatParser.default = ENRelativeDateFormatParser$1;
    	
    	return ENRelativeDateFormatParser;
    }

    var chrono = {};

    var hasRequiredChrono;

    function requireChrono () {
    	if (hasRequiredChrono) return chrono;
    	hasRequiredChrono = 1;
    	Object.defineProperty(chrono, "__esModule", { value: true });
    	chrono.ParsingContext = chrono.Chrono = void 0;
    	const results_1 = requireResults();
    	const en_1 = requireEn();
    	class Chrono {
    	    constructor(configuration) {
    	        configuration = configuration || en_1.createCasualConfiguration();
    	        this.parsers = [...configuration.parsers];
    	        this.refiners = [...configuration.refiners];
    	    }
    	    clone() {
    	        return new Chrono({
    	            parsers: [...this.parsers],
    	            refiners: [...this.refiners],
    	        });
    	    }
    	    parseDate(text, referenceDate, option) {
    	        const results = this.parse(text, referenceDate, option);
    	        return results.length > 0 ? results[0].start.date() : null;
    	    }
    	    parse(text, referenceDate, option) {
    	        const context = new ParsingContext(text, referenceDate, option);
    	        let results = [];
    	        this.parsers.forEach((parser) => {
    	            const parsedResults = Chrono.executeParser(context, parser);
    	            results = results.concat(parsedResults);
    	        });
    	        results.sort((a, b) => {
    	            return a.index - b.index;
    	        });
    	        this.refiners.forEach(function (refiner) {
    	            results = refiner.refine(context, results);
    	        });
    	        return results;
    	    }
    	    static executeParser(context, parser) {
    	        const results = [];
    	        const pattern = parser.pattern(context);
    	        const originalText = context.text;
    	        let remainingText = context.text;
    	        let match = pattern.exec(remainingText);
    	        while (match) {
    	            const index = match.index + originalText.length - remainingText.length;
    	            match.index = index;
    	            const result = parser.extract(context, match);
    	            if (!result) {
    	                remainingText = originalText.substring(match.index + 1);
    	                match = pattern.exec(remainingText);
    	                continue;
    	            }
    	            let parsedResult = null;
    	            if (result instanceof results_1.ParsingResult) {
    	                parsedResult = result;
    	            }
    	            else if (result instanceof results_1.ParsingComponents) {
    	                parsedResult = context.createParsingResult(match.index, match[0]);
    	                parsedResult.start = result;
    	            }
    	            else {
    	                parsedResult = context.createParsingResult(match.index, match[0], result);
    	            }
    	            context.debug(() => console.log(`${parser.constructor.name} extracted result ${parsedResult}`));
    	            results.push(parsedResult);
    	            remainingText = originalText.substring(index + parsedResult.text.length);
    	            match = pattern.exec(remainingText);
    	        }
    	        return results;
    	    }
    	}
    	chrono.Chrono = Chrono;
    	class ParsingContext {
    	    constructor(text, refDate, option) {
    	        this.text = text;
    	        this.reference = new results_1.ReferenceWithTimezone(refDate);
    	        this.option = option !== null && option !== void 0 ? option : {};
    	        this.refDate = this.reference.instant;
    	    }
    	    createParsingComponents(components) {
    	        if (components instanceof results_1.ParsingComponents) {
    	            return components;
    	        }
    	        return new results_1.ParsingComponents(this.reference, components);
    	    }
    	    createParsingResult(index, textOrEndIndex, startComponents, endComponents) {
    	        const text = typeof textOrEndIndex === "string" ? textOrEndIndex : this.text.substring(index, textOrEndIndex);
    	        const start = startComponents ? this.createParsingComponents(startComponents) : null;
    	        const end = endComponents ? this.createParsingComponents(endComponents) : null;
    	        return new results_1.ParsingResult(this.reference, index, text, start, end);
    	    }
    	    debug(block) {
    	        if (this.option.debug) {
    	            if (this.option.debug instanceof Function) {
    	                this.option.debug(block);
    	            }
    	            else {
    	                const handler = this.option.debug;
    	                handler.debug(block);
    	            }
    	        }
    	    }
    	}
    	chrono.ParsingContext = ParsingContext;
    	
    	return chrono;
    }

    var SlashDateFormatParser$1 = {};

    Object.defineProperty(SlashDateFormatParser$1, "__esModule", { value: true });
    const years_1$9 = years;
    const PATTERN$h = new RegExp("([^\\d]|^)" +
        "([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})" +
        "(?:[\\/\\.\\-]([0-9]{4}|[0-9]{2}))?" +
        "(\\W|$)", "i");
    const OPENING_GROUP = 1;
    const ENDING_GROUP = 5;
    const FIRST_NUMBERS_GROUP = 2;
    const SECOND_NUMBERS_GROUP = 3;
    const YEAR_GROUP$b = 4;
    class SlashDateFormatParser {
        constructor(littleEndian) {
            this.groupNumberMonth = littleEndian ? SECOND_NUMBERS_GROUP : FIRST_NUMBERS_GROUP;
            this.groupNumberDay = littleEndian ? FIRST_NUMBERS_GROUP : SECOND_NUMBERS_GROUP;
        }
        pattern() {
            return PATTERN$h;
        }
        extract(context, match) {
            if (match[OPENING_GROUP].length == 0 && match.index > 0 && match.index < context.text.length) {
                const previousChar = context.text[match.index - 1];
                if (previousChar >= "0" && previousChar <= "9") {
                    return;
                }
            }
            const index = match.index + match[OPENING_GROUP].length;
            const text = match[0].substr(match[OPENING_GROUP].length, match[0].length - match[OPENING_GROUP].length - match[ENDING_GROUP].length);
            if (text.match(/^\d\.\d$/) || text.match(/^\d\.\d{1,2}\.\d{1,2}\s*$/)) {
                return;
            }
            if (!match[YEAR_GROUP$b] && match[0].indexOf("/") < 0) {
                return;
            }
            const result = context.createParsingResult(index, text);
            let month = parseInt(match[this.groupNumberMonth]);
            let day = parseInt(match[this.groupNumberDay]);
            if (month < 1 || month > 12) {
                if (month > 12) {
                    if (day >= 1 && day <= 12 && month <= 31) {
                        [day, month] = [month, day];
                    }
                    else {
                        return null;
                    }
                }
            }
            if (day < 1 || day > 31) {
                return null;
            }
            result.start.assign("day", day);
            result.start.assign("month", month);
            if (match[YEAR_GROUP$b]) {
                const rawYearNumber = parseInt(match[YEAR_GROUP$b]);
                const year = years_1$9.findMostLikelyADYear(rawYearNumber);
                result.start.assign("year", year);
            }
            else {
                const year = years_1$9.findYearClosestToRef(context.refDate, day, month);
                result.start.imply("year", year);
            }
            return result;
        }
    }
    SlashDateFormatParser$1.default = SlashDateFormatParser;

    var ENTimeUnitCasualRelativeFormatParser = {};

    var hasRequiredENTimeUnitCasualRelativeFormatParser;

    function requireENTimeUnitCasualRelativeFormatParser () {
    	if (hasRequiredENTimeUnitCasualRelativeFormatParser) return ENTimeUnitCasualRelativeFormatParser;
    	hasRequiredENTimeUnitCasualRelativeFormatParser = 1;
    	Object.defineProperty(ENTimeUnitCasualRelativeFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$9;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const timeunits_1 = timeunits;
    	const PATTERN = new RegExp(`(this|last|past|next|after|\\+|-)\\s*(${constants_1.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    	let ENTimeUnitCasualRelativeFormatParser$1 = class ENTimeUnitCasualRelativeFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const prefix = match[1].toLowerCase();
    	        let timeUnits = constants_1.parseTimeUnits(match[2]);
    	        switch (prefix) {
    	            case "last":
    	            case "past":
    	            case "-":
    	                timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
    	                break;
    	        }
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	    }
    	};
    	ENTimeUnitCasualRelativeFormatParser.default = ENTimeUnitCasualRelativeFormatParser$1;
    	
    	return ENTimeUnitCasualRelativeFormatParser;
    }

    var ENMergeRelativeDateRefiner = {};

    var hasRequiredENMergeRelativeDateRefiner;

    function requireENMergeRelativeDateRefiner () {
    	if (hasRequiredENMergeRelativeDateRefiner) return ENMergeRelativeDateRefiner;
    	hasRequiredENMergeRelativeDateRefiner = 1;
    	Object.defineProperty(ENMergeRelativeDateRefiner, "__esModule", { value: true });
    	const abstractRefiners_1 = abstractRefiners;
    	const results_1 = requireResults();
    	const constants_1 = constants$9;
    	const timeunits_1 = timeunits;
    	function hasImpliedEarlierReferenceDate(result) {
    	    return result.text.match(/\s+(before|from)$/i) != null;
    	}
    	function hasImpliedLaterReferenceDate(result) {
    	    return result.text.match(/\s+(after|since)$/i) != null;
    	}
    	let ENMergeRelativeDateRefiner$1 = class ENMergeRelativeDateRefiner extends abstractRefiners_1.MergingRefiner {
    	    patternBetween() {
    	        return /^\s*$/i;
    	    }
    	    shouldMergeResults(textBetween, currentResult, nextResult) {
    	        if (!textBetween.match(this.patternBetween())) {
    	            return false;
    	        }
    	        if (!hasImpliedEarlierReferenceDate(currentResult) && !hasImpliedLaterReferenceDate(currentResult)) {
    	            return false;
    	        }
    	        return !!nextResult.start.get("day") && !!nextResult.start.get("month") && !!nextResult.start.get("year");
    	    }
    	    mergeResults(textBetween, currentResult, nextResult) {
    	        let timeUnits = constants_1.parseTimeUnits(currentResult.text);
    	        if (hasImpliedEarlierReferenceDate(currentResult)) {
    	            timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
    	        }
    	        const components = results_1.ParsingComponents.createRelativeFromReference(new results_1.ReferenceWithTimezone(nextResult.start.date()), timeUnits);
    	        return new results_1.ParsingResult(nextResult.reference, currentResult.index, `${currentResult.text}${textBetween}${nextResult.text}`, components);
    	    }
    	};
    	ENMergeRelativeDateRefiner.default = ENMergeRelativeDateRefiner$1;
    	
    	return ENMergeRelativeDateRefiner;
    }

    var hasRequiredEn;

    function requireEn () {
    	if (hasRequiredEn) return en;
    	hasRequiredEn = 1;
    	(function (exports) {
    		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    		    return (mod && mod.__esModule) ? mod : { "default": mod };
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.GB = exports.strict = exports.casual = void 0;
    		const ENTimeUnitWithinFormatParser_1 = __importDefault(requireENTimeUnitWithinFormatParser());
    		const ENMonthNameLittleEndianParser_1 = __importDefault(ENMonthNameLittleEndianParser$1);
    		const ENMonthNameMiddleEndianParser_1 = __importDefault(ENMonthNameMiddleEndianParser$1);
    		const ENMonthNameParser_1 = __importDefault(ENMonthNameParser$1);
    		const ENCasualYearMonthDayParser_1 = __importDefault(ENCasualYearMonthDayParser$1);
    		const ENSlashMonthFormatParser_1 = __importDefault(ENSlashMonthFormatParser$1);
    		const ENTimeExpressionParser_1 = __importDefault(requireENTimeExpressionParser());
    		const ENTimeUnitAgoFormatParser_1 = __importDefault(requireENTimeUnitAgoFormatParser());
    		const ENTimeUnitLaterFormatParser_1 = __importDefault(requireENTimeUnitLaterFormatParser());
    		const ENMergeDateRangeRefiner_1 = __importDefault(ENMergeDateRangeRefiner$1);
    		const ENMergeDateTimeRefiner_1 = __importDefault(requireENMergeDateTimeRefiner());
    		const configurations_1 = requireConfigurations();
    		const ENCasualDateParser_1 = __importDefault(requireENCasualDateParser());
    		const ENCasualTimeParser_1 = __importDefault(requireENCasualTimeParser());
    		const ENWeekdayParser_1 = __importDefault(requireENWeekdayParser());
    		const ENRelativeDateFormatParser_1 = __importDefault(requireENRelativeDateFormatParser());
    		const chrono_1 = requireChrono();
    		const SlashDateFormatParser_1 = __importDefault(SlashDateFormatParser$1);
    		const ENTimeUnitCasualRelativeFormatParser_1 = __importDefault(requireENTimeUnitCasualRelativeFormatParser());
    		const ENMergeRelativeDateRefiner_1 = __importDefault(requireENMergeRelativeDateRefiner());
    		exports.casual = new chrono_1.Chrono(createCasualConfiguration(false));
    		exports.strict = new chrono_1.Chrono(createConfiguration(true, false));
    		exports.GB = new chrono_1.Chrono(createConfiguration(false, true));
    		function parse(text, ref, option) {
    		    return exports.casual.parse(text, ref, option);
    		}
    		exports.parse = parse;
    		function parseDate(text, ref, option) {
    		    return exports.casual.parseDate(text, ref, option);
    		}
    		exports.parseDate = parseDate;
    		function createCasualConfiguration(littleEndian = false) {
    		    const option = createConfiguration(false, littleEndian);
    		    option.parsers.unshift(new ENCasualDateParser_1.default());
    		    option.parsers.unshift(new ENCasualTimeParser_1.default());
    		    option.parsers.unshift(new ENMonthNameParser_1.default());
    		    option.parsers.unshift(new ENRelativeDateFormatParser_1.default());
    		    option.parsers.unshift(new ENTimeUnitCasualRelativeFormatParser_1.default());
    		    return option;
    		}
    		exports.createCasualConfiguration = createCasualConfiguration;
    		function createConfiguration(strictMode = true, littleEndian = false) {
    		    return configurations_1.includeCommonConfiguration({
    		        parsers: [
    		            new SlashDateFormatParser_1.default(littleEndian),
    		            new ENTimeUnitWithinFormatParser_1.default(),
    		            new ENMonthNameLittleEndianParser_1.default(),
    		            new ENMonthNameMiddleEndianParser_1.default(),
    		            new ENWeekdayParser_1.default(),
    		            new ENCasualYearMonthDayParser_1.default(),
    		            new ENSlashMonthFormatParser_1.default(),
    		            new ENTimeExpressionParser_1.default(strictMode),
    		            new ENTimeUnitAgoFormatParser_1.default(strictMode),
    		            new ENTimeUnitLaterFormatParser_1.default(strictMode),
    		        ],
    		        refiners: [new ENMergeRelativeDateRefiner_1.default(), new ENMergeDateTimeRefiner_1.default(), new ENMergeDateRangeRefiner_1.default()],
    		    }, strictMode);
    		}
    		exports.createConfiguration = createConfiguration;
    		
    } (en));
    	return en;
    }

    var de = {};

    var DETimeExpressionParser = {};

    var hasRequiredDETimeExpressionParser;

    function requireDETimeExpressionParser () {
    	if (hasRequiredDETimeExpressionParser) return DETimeExpressionParser;
    	hasRequiredDETimeExpressionParser = 1;
    	Object.defineProperty(DETimeExpressionParser, "__esModule", { value: true });
    	const AbstractTimeExpressionParser_1 = requireAbstractTimeExpressionParser();
    	let DETimeExpressionParser$1 = class DETimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    	    primaryPrefix() {
    	        return "(?:(?:um|von)\\s*)?";
    	    }
    	    followingPhase() {
    	        return "\\s*(?:\\-|\\–|\\~|\\〜|bis)\\s*";
    	    }
    	    extractPrimaryTimeComponents(context, match) {
    	        if (match[0].match(/^\s*\d{4}\s*$/)) {
    	            return null;
    	        }
    	        return super.extractPrimaryTimeComponents(context, match);
    	    }
    	};
    	DETimeExpressionParser.default = DETimeExpressionParser$1;
    	
    	return DETimeExpressionParser;
    }

    var DEWeekdayParser = {};

    var constants$8 = {};

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
    	const pattern_1 = pattern;
    	const years_1 = years;
    	exports.WEEKDAY_DICTIONARY = {
    	    "sonntag": 0,
    	    "so": 0,
    	    "montag": 1,
    	    "mo": 1,
    	    "dienstag": 2,
    	    "di": 2,
    	    "mittwoch": 3,
    	    "mi": 3,
    	    "donnerstag": 4,
    	    "do": 4,
    	    "freitag": 5,
    	    "fr": 5,
    	    "samstag": 6,
    	    "sa": 6,
    	};
    	exports.MONTH_DICTIONARY = {
    	    "januar": 1,
    	    "jänner": 1,
    	    "janner": 1,
    	    "jan": 1,
    	    "jan.": 1,
    	    "februar": 2,
    	    "feber": 2,
    	    "feb": 2,
    	    "feb.": 2,
    	    "märz": 3,
    	    "maerz": 3,
    	    "mär": 3,
    	    "mär.": 3,
    	    "mrz": 3,
    	    "mrz.": 3,
    	    "april": 4,
    	    "apr": 4,
    	    "apr.": 4,
    	    "mai": 5,
    	    "juni": 6,
    	    "jun": 6,
    	    "jun.": 6,
    	    "juli": 7,
    	    "jul": 7,
    	    "jul.": 7,
    	    "august": 8,
    	    "aug": 8,
    	    "aug.": 8,
    	    "september": 9,
    	    "sep": 9,
    	    "sep.": 9,
    	    "sept": 9,
    	    "sept.": 9,
    	    "oktober": 10,
    	    "okt": 10,
    	    "okt.": 10,
    	    "november": 11,
    	    "nov": 11,
    	    "nov.": 11,
    	    "dezember": 12,
    	    "dez": 12,
    	    "dez.": 12,
    	};
    	exports.INTEGER_WORD_DICTIONARY = {
    	    "eins": 1,
    	    "eine": 1,
    	    "einem": 1,
    	    "einen": 1,
    	    "einer": 1,
    	    "zwei": 2,
    	    "drei": 3,
    	    "vier": 4,
    	    "fünf": 5,
    	    "fuenf": 5,
    	    "sechs": 6,
    	    "sieben": 7,
    	    "acht": 8,
    	    "neun": 9,
    	    "zehn": 10,
    	    "elf": 11,
    	    "zwölf": 12,
    	    "zwoelf": 12,
    	};
    	exports.TIME_UNIT_DICTIONARY = {
    	    sek: "second",
    	    sekunde: "second",
    	    sekunden: "second",
    	    min: "minute",
    	    minute: "minute",
    	    minuten: "minute",
    	    h: "hour",
    	    std: "hour",
    	    stunde: "hour",
    	    stunden: "hour",
    	    tag: "d",
    	    tage: "d",
    	    tagen: "d",
    	    woche: "week",
    	    wochen: "week",
    	    monat: "month",
    	    monate: "month",
    	    monaten: "month",
    	    monats: "month",
    	    quartal: "quarter",
    	    quartals: "quarter",
    	    quartale: "quarter",
    	    quartalen: "quarter",
    	    a: "year",
    	    j: "year",
    	    jr: "year",
    	    jahr: "year",
    	    jahre: "year",
    	    jahren: "year",
    	    jahres: "year",
    	};
    	exports.NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|halb?|halbe?|einigen?|wenigen?|mehreren?)`;
    	function parseNumberPattern(match) {
    	    const num = match.toLowerCase();
    	    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
    	        return exports.INTEGER_WORD_DICTIONARY[num];
    	    }
    	    else if (num === "ein" || num === "einer" || num === "einem" || num === "einen" || num === "eine") {
    	        return 1;
    	    }
    	    else if (num.match(/wenigen/)) {
    	        return 2;
    	    }
    	    else if (num.match(/halb/) || num.match(/halben/)) {
    	        return 0.5;
    	    }
    	    else if (num.match(/einigen/)) {
    	        return 3;
    	    }
    	    else if (num.match(/mehreren/)) {
    	        return 7;
    	    }
    	    return parseFloat(num);
    	}
    	exports.parseNumberPattern = parseNumberPattern;
    	exports.YEAR_PATTERN = `(?:[0-9]{1,4}(?:\\s*[vn]\\.?\\s*(?:C(?:hr)?|(?:u\\.?|d\\.?(?:\\s*g\\.?)?)?\\s*Z)\\.?|\\s*(?:u\\.?|d\\.?(?:\\s*g\\.)?)\\s*Z\\.?)?)`;
    	function parseYear(match) {
    	    if (/v/i.test(match)) {
    	        return -parseInt(match.replace(/[^0-9]+/gi, ""));
    	    }
    	    if (/n/i.test(match)) {
    	        return parseInt(match.replace(/[^0-9]+/gi, ""));
    	    }
    	    if (/z/i.test(match)) {
    	        return parseInt(match.replace(/[^0-9]+/gi, ""));
    	    }
    	    const rawYearNumber = parseInt(match);
    	    return years_1.findMostLikelyADYear(rawYearNumber);
    	}
    	exports.parseYear = parseYear;
    	const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
    	const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
    	exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
    	function parseTimeUnits(timeunitText) {
    	    const fragments = {};
    	    let remainingText = timeunitText;
    	    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    while (match) {
    	        collectDateTimeFragment(fragments, match);
    	        remainingText = remainingText.substring(match[0].length);
    	        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    }
    	    return fragments;
    	}
    	exports.parseTimeUnits = parseTimeUnits;
    	function collectDateTimeFragment(fragments, match) {
    	    const num = parseNumberPattern(match[1]);
    	    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    	    fragments[unit] = num;
    	}
    	
    } (constants$8));

    var hasRequiredDEWeekdayParser;

    function requireDEWeekdayParser () {
    	if (hasRequiredDEWeekdayParser) return DEWeekdayParser;
    	hasRequiredDEWeekdayParser = 1;
    	Object.defineProperty(DEWeekdayParser, "__esModule", { value: true });
    	const constants_1 = constants$8;
    	const pattern_1 = pattern;
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const weekdays_1 = requireWeekdays();
    	const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    	    "(?:a[mn]\\s*?)?" +
    	    "(?:(diese[mn]|letzte[mn]|n(?:ä|ae)chste[mn])\\s*)?" +
    	    `(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})` +
    	    "(?:\\s*(?:\\,|\\)|\\）))?" +
    	    "(?:\\s*(diese|letzte|n(?:ä|ae)chste)\\s*woche)?" +
    	    "(?=\\W|$)", "i");
    	const PREFIX_GROUP = 1;
    	const SUFFIX_GROUP = 3;
    	const WEEKDAY_GROUP = 2;
    	let DEWeekdayParser$1 = class DEWeekdayParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
    	        const offset = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
    	        const prefix = match[PREFIX_GROUP];
    	        const postfix = match[SUFFIX_GROUP];
    	        let modifierWord = prefix || postfix;
    	        modifierWord = modifierWord || "";
    	        modifierWord = modifierWord.toLowerCase();
    	        let modifier = null;
    	        if (modifierWord.match(/letzte/)) {
    	            modifier = "last";
    	        }
    	        else if (modifierWord.match(/chste/)) {
    	            modifier = "next";
    	        }
    	        else if (modifierWord.match(/diese/)) {
    	            modifier = "this";
    	        }
    	        return weekdays_1.createParsingComponentsAtWeekday(context.reference, offset, modifier);
    	    }
    	};
    	DEWeekdayParser.default = DEWeekdayParser$1;
    	
    	return DEWeekdayParser;
    }

    var DESpecificTimeExpressionParser = {};

    var hasRequiredDESpecificTimeExpressionParser;

    function requireDESpecificTimeExpressionParser () {
    	if (hasRequiredDESpecificTimeExpressionParser) return DESpecificTimeExpressionParser;
    	hasRequiredDESpecificTimeExpressionParser = 1;
    	Object.defineProperty(DESpecificTimeExpressionParser, "__esModule", { value: true });
    	const index_1 = requireDist();
    	const FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" +
    	    "(?:(?:um|von)\\s*)?" +
    	    "(\\d{1,2})(?:h|:)?" +
    	    "(?:(\\d{1,2})(?:m|:)?)?" +
    	    "(?:(\\d{1,2})(?:s)?)?" +
    	    "(?:\\s*Uhr)?" +
    	    "(?:\\s*(morgens|vormittags|nachmittags|abends|nachts|am\\s+(?:Morgen|Vormittag|Nachmittag|Abend)|in\\s+der\\s+Nacht))?" +
    	    "(?=\\W|$)", "i");
    	const SECOND_REG_PATTERN = new RegExp("^\\s*(\\-|\\–|\\~|\\〜|bis(?:\\s+um)?|\\?)\\s*" +
    	    "(\\d{1,2})(?:h|:)?" +
    	    "(?:(\\d{1,2})(?:m|:)?)?" +
    	    "(?:(\\d{1,2})(?:s)?)?" +
    	    "(?:\\s*Uhr)?" +
    	    "(?:\\s*(morgens|vormittags|nachmittags|abends|nachts|am\\s+(?:Morgen|Vormittag|Nachmittag|Abend)|in\\s+der\\s+Nacht))?" +
    	    "(?=\\W|$)", "i");
    	const HOUR_GROUP = 2;
    	const MINUTE_GROUP = 3;
    	const SECOND_GROUP = 4;
    	const AM_PM_HOUR_GROUP = 5;
    	let DESpecificTimeExpressionParser$1 = class DESpecificTimeExpressionParser {
    	    pattern(context) {
    	        return FIRST_REG_PATTERN;
    	    }
    	    extract(context, match) {
    	        const result = context.createParsingResult(match.index + match[1].length, match[0].substring(match[1].length));
    	        if (result.text.match(/^\d{4}$/)) {
    	            match.index += match[0].length;
    	            return null;
    	        }
    	        result.start = DESpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), match);
    	        if (!result.start) {
    	            match.index += match[0].length;
    	            return null;
    	        }
    	        const remainingText = context.text.substring(match.index + match[0].length);
    	        const secondMatch = SECOND_REG_PATTERN.exec(remainingText);
    	        if (secondMatch) {
    	            result.end = DESpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), secondMatch);
    	            if (result.end) {
    	                result.text += secondMatch[0];
    	            }
    	        }
    	        return result;
    	    }
    	    static extractTimeComponent(extractingComponents, match) {
    	        let hour = 0;
    	        let minute = 0;
    	        let meridiem = null;
    	        hour = parseInt(match[HOUR_GROUP]);
    	        if (match[MINUTE_GROUP] != null) {
    	            minute = parseInt(match[MINUTE_GROUP]);
    	        }
    	        if (minute >= 60 || hour > 24) {
    	            return null;
    	        }
    	        if (hour >= 12) {
    	            meridiem = index_1.Meridiem.PM;
    	        }
    	        if (match[AM_PM_HOUR_GROUP] != null) {
    	            if (hour > 12)
    	                return null;
    	            const ampm = match[AM_PM_HOUR_GROUP].toLowerCase();
    	            if (ampm.match(/morgen|vormittag/)) {
    	                meridiem = index_1.Meridiem.AM;
    	                if (hour == 12) {
    	                    hour = 0;
    	                }
    	            }
    	            if (ampm.match(/nachmittag|abend/)) {
    	                meridiem = index_1.Meridiem.PM;
    	                if (hour != 12) {
    	                    hour += 12;
    	                }
    	            }
    	            if (ampm.match(/nacht/)) {
    	                if (hour == 12) {
    	                    meridiem = index_1.Meridiem.AM;
    	                    hour = 0;
    	                }
    	                else if (hour < 6) {
    	                    meridiem = index_1.Meridiem.AM;
    	                }
    	                else {
    	                    meridiem = index_1.Meridiem.PM;
    	                    hour += 12;
    	                }
    	            }
    	        }
    	        extractingComponents.assign("hour", hour);
    	        extractingComponents.assign("minute", minute);
    	        if (meridiem !== null) {
    	            extractingComponents.assign("meridiem", meridiem);
    	        }
    	        else {
    	            if (hour < 12) {
    	                extractingComponents.imply("meridiem", index_1.Meridiem.AM);
    	            }
    	            else {
    	                extractingComponents.imply("meridiem", index_1.Meridiem.PM);
    	            }
    	        }
    	        if (match[SECOND_GROUP] != null) {
    	            const second = parseInt(match[SECOND_GROUP]);
    	            if (second >= 60)
    	                return null;
    	            extractingComponents.assign("second", second);
    	        }
    	        return extractingComponents;
    	    }
    	};
    	DESpecificTimeExpressionParser.default = DESpecificTimeExpressionParser$1;
    	
    	return DESpecificTimeExpressionParser;
    }

    var DEMergeDateRangeRefiner$1 = {};

    var __importDefault$l = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(DEMergeDateRangeRefiner$1, "__esModule", { value: true });
    const AbstractMergeDateRangeRefiner_1$8 = __importDefault$l(AbstractMergeDateRangeRefiner$1);
    class DEMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$8.default {
        patternBetween() {
            return /^\s*(bis(?:\s*(?:am|zum))?|-)\s*$/i;
        }
    }
    DEMergeDateRangeRefiner$1.default = DEMergeDateRangeRefiner;

    var DEMergeDateTimeRefiner = {};

    var hasRequiredDEMergeDateTimeRefiner;

    function requireDEMergeDateTimeRefiner () {
    	if (hasRequiredDEMergeDateTimeRefiner) return DEMergeDateTimeRefiner;
    	hasRequiredDEMergeDateTimeRefiner = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(DEMergeDateTimeRefiner, "__esModule", { value: true });
    	const AbstractMergeDateTimeRefiner_1 = __importDefault(requireAbstractMergeDateTimeRefiner());
    	let DEMergeDateTimeRefiner$1 = class DEMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    	    patternBetween() {
    	        return new RegExp("^\\s*(T|um|am|,|-)?\\s*$");
    	    }
    	};
    	DEMergeDateTimeRefiner.default = DEMergeDateTimeRefiner$1;
    	
    	return DEMergeDateTimeRefiner;
    }

    var DECasualDateParser = {};

    var DECasualTimeParser = {};

    var hasRequiredDECasualTimeParser;

    function requireDECasualTimeParser () {
    	if (hasRequiredDECasualTimeParser) return DECasualTimeParser;
    	hasRequiredDECasualTimeParser = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(DECasualTimeParser, "__esModule", { value: true });
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const index_1 = requireDist();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const dayjs_2 = requireDayjs();
    	const timeunits_1 = timeunits;
    	let DECasualTimeParser$1 = class DECasualTimeParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern(context) {
    	        return /(diesen)?\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht)(?=\W|$)/i;
    	    }
    	    innerExtract(context, match) {
    	        const targetDate = dayjs_1.default(context.refDate);
    	        const timeKeywordPattern = match[2].toLowerCase();
    	        const component = context.createParsingComponents();
    	        dayjs_2.implySimilarTime(component, targetDate);
    	        return DECasualTimeParser.extractTimeComponents(component, timeKeywordPattern);
    	    }
    	    static extractTimeComponents(component, timeKeywordPattern) {
    	        switch (timeKeywordPattern) {
    	            case "morgen":
    	                component.imply("hour", 6);
    	                component.imply("minute", 0);
    	                component.imply("second", 0);
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                break;
    	            case "vormittag":
    	                component.imply("hour", 9);
    	                component.imply("minute", 0);
    	                component.imply("second", 0);
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                break;
    	            case "mittag":
    	            case "mittags":
    	                component.imply("hour", 12);
    	                component.imply("minute", 0);
    	                component.imply("second", 0);
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                break;
    	            case "nachmittag":
    	                component.imply("hour", 15);
    	                component.imply("minute", 0);
    	                component.imply("second", 0);
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                break;
    	            case "abend":
    	                component.imply("hour", 18);
    	                component.imply("minute", 0);
    	                component.imply("second", 0);
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                break;
    	            case "nacht":
    	                component.imply("hour", 22);
    	                component.imply("minute", 0);
    	                component.imply("second", 0);
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                break;
    	            case "mitternacht":
    	                if (component.get("hour") > 1) {
    	                    component = timeunits_1.addImpliedTimeUnits(component, { "day": 1 });
    	                }
    	                component.imply("hour", 0);
    	                component.imply("minute", 0);
    	                component.imply("second", 0);
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                break;
    	        }
    	        return component;
    	    }
    	};
    	DECasualTimeParser.default = DECasualTimeParser$1;
    	
    	return DECasualTimeParser;
    }

    var hasRequiredDECasualDateParser;

    function requireDECasualDateParser () {
    	if (hasRequiredDECasualDateParser) return DECasualDateParser;
    	hasRequiredDECasualDateParser = 1;
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(DECasualDateParser, "__esModule", { value: true });
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const dayjs_2 = requireDayjs();
    	const DECasualTimeParser_1 = __importDefault(requireDECasualTimeParser());
    	const references = __importStar(requireCasualReferences());
    	const PATTERN = new RegExp(`(jetzt|heute|morgen|übermorgen|uebermorgen|gestern|vorgestern|letzte\\s*nacht)` +
    	    `(?:\\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht))?` +
    	    `(?=\\W|$)`, "i");
    	const DATE_GROUP = 1;
    	const TIME_GROUP = 2;
    	let DECasualDateParser$1 = class DECasualDateParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern(context) {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        let targetDate = dayjs_1.default(context.refDate);
    	        const dateKeyword = (match[DATE_GROUP] || "").toLowerCase();
    	        const timeKeyword = (match[TIME_GROUP] || "").toLowerCase();
    	        let component = context.createParsingComponents();
    	        switch (dateKeyword) {
    	            case "jetzt":
    	                component = references.now(context.reference);
    	                break;
    	            case "heute":
    	                component = references.today(context.reference);
    	                break;
    	            case "morgen":
    	                dayjs_2.assignTheNextDay(component, targetDate);
    	                break;
    	            case "übermorgen":
    	            case "uebermorgen":
    	                targetDate = targetDate.add(1, "day");
    	                dayjs_2.assignTheNextDay(component, targetDate);
    	                break;
    	            case "gestern":
    	                targetDate = targetDate.add(-1, "day");
    	                dayjs_2.assignSimilarDate(component, targetDate);
    	                dayjs_2.implySimilarTime(component, targetDate);
    	                break;
    	            case "vorgestern":
    	                targetDate = targetDate.add(-2, "day");
    	                dayjs_2.assignSimilarDate(component, targetDate);
    	                dayjs_2.implySimilarTime(component, targetDate);
    	                break;
    	            default:
    	                if (dateKeyword.match(/letzte\s*nacht/)) {
    	                    if (targetDate.hour() > 6) {
    	                        targetDate = targetDate.add(-1, "day");
    	                    }
    	                    dayjs_2.assignSimilarDate(component, targetDate);
    	                    component.imply("hour", 0);
    	                }
    	                break;
    	        }
    	        if (timeKeyword) {
    	            component = DECasualTimeParser_1.default.extractTimeComponents(component, timeKeyword);
    	        }
    	        return component;
    	    }
    	};
    	DECasualDateParser.default = DECasualDateParser$1;
    	
    	return DECasualDateParser;
    }

    var DEMonthNameLittleEndianParser$1 = {};

    Object.defineProperty(DEMonthNameLittleEndianParser$1, "__esModule", { value: true });
    const years_1$8 = years;
    const constants_1$j = constants$8;
    const constants_2$7 = constants$8;
    const pattern_1$8 = pattern;
    const AbstractParserWithWordBoundary_1$l = AbstractParserWithWordBoundary;
    const PATTERN$g = new RegExp("(?:am\\s*?)?" +
        "(?:den\\s*?)?" +
        `([0-9]{1,2})\\.` +
        `(?:\\s*(?:bis(?:\\s*(?:am|zum))?|\\-|\\–|\\s)\\s*([0-9]{1,2})\\.?)?\\s*` +
        `(${pattern_1$8.matchAnyPattern(constants_1$j.MONTH_DICTIONARY)})` +
        `(?:(?:-|/|,?\\s*)(${constants_2$7.YEAR_PATTERN}(?![^\\s]\\d)))?` +
        `(?=\\W|$)`, "i");
    const DATE_GROUP$5 = 1;
    const DATE_TO_GROUP$5 = 2;
    const MONTH_NAME_GROUP$8 = 3;
    const YEAR_GROUP$a = 4;
    class DEMonthNameLittleEndianParser extends AbstractParserWithWordBoundary_1$l.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$g;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            const month = constants_1$j.MONTH_DICTIONARY[match[MONTH_NAME_GROUP$8].toLowerCase()];
            const day = parseInt(match[DATE_GROUP$5]);
            if (day > 31) {
                match.index = match.index + match[DATE_GROUP$5].length;
                return null;
            }
            result.start.assign("month", month);
            result.start.assign("day", day);
            if (match[YEAR_GROUP$a]) {
                const yearNumber = constants_2$7.parseYear(match[YEAR_GROUP$a]);
                result.start.assign("year", yearNumber);
            }
            else {
                const year = years_1$8.findYearClosestToRef(context.refDate, day, month);
                result.start.imply("year", year);
            }
            if (match[DATE_TO_GROUP$5]) {
                const endDate = parseInt(match[DATE_TO_GROUP$5]);
                result.end = result.start.clone();
                result.end.assign("day", endDate);
            }
            return result;
        }
    }
    DEMonthNameLittleEndianParser$1.default = DEMonthNameLittleEndianParser;

    var DETimeUnitRelativeFormatParser = {};

    var hasRequiredDETimeUnitRelativeFormatParser;

    function requireDETimeUnitRelativeFormatParser () {
    	if (hasRequiredDETimeUnitRelativeFormatParser) return DETimeUnitRelativeFormatParser;
    	hasRequiredDETimeUnitRelativeFormatParser = 1;
    	Object.defineProperty(DETimeUnitRelativeFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$8;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const timeunits_1 = timeunits;
    	const pattern_1 = pattern;
    	class DETimeUnitAgoFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    constructor() {
    	        super();
    	    }
    	    innerPattern() {
    	        return new RegExp(`(?:\\s*((?:nächste|kommende|folgende|letzte|vergangene|vorige|vor(?:her|an)gegangene)(?:s|n|m|r)?|vor|in)\\s*)?` +
    	            `(${constants_1.NUMBER_PATTERN})?` +
    	            `(?:\\s*(nächste|kommende|folgende|letzte|vergangene|vorige|vor(?:her|an)gegangene)(?:s|n|m|r)?)?` +
    	            `\\s*(${pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY)})`, "i");
    	    }
    	    innerExtract(context, match) {
    	        const num = match[2] ? constants_1.parseNumberPattern(match[2]) : 1;
    	        const unit = constants_1.TIME_UNIT_DICTIONARY[match[4].toLowerCase()];
    	        let timeUnits = {};
    	        timeUnits[unit] = num;
    	        let modifier = match[1] || match[3] || "";
    	        modifier = modifier.toLowerCase();
    	        if (!modifier) {
    	            return;
    	        }
    	        if (/vor/.test(modifier) || /letzte/.test(modifier) || /vergangen/.test(modifier)) {
    	            timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
    	        }
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	    }
    	}
    	DETimeUnitRelativeFormatParser.default = DETimeUnitAgoFormatParser;
    	
    	return DETimeUnitRelativeFormatParser;
    }

    var DETimeUnitWithinFormatParser = {};

    var hasRequiredDETimeUnitWithinFormatParser;

    function requireDETimeUnitWithinFormatParser () {
    	if (hasRequiredDETimeUnitWithinFormatParser) return DETimeUnitWithinFormatParser;
    	hasRequiredDETimeUnitWithinFormatParser = 1;
    	Object.defineProperty(DETimeUnitWithinFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$8;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	let DETimeUnitWithinFormatParser$1 = class DETimeUnitWithinFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return new RegExp(`(?:in|für|während)\\s*(${constants_1.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    	    }
    	    innerExtract(context, match) {
    	        const timeUnits = constants_1.parseTimeUnits(match[1]);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	    }
    	};
    	DETimeUnitWithinFormatParser.default = DETimeUnitWithinFormatParser$1;
    	
    	return DETimeUnitWithinFormatParser;
    }

    var hasRequiredDe;

    function requireDe () {
    	if (hasRequiredDe) return de;
    	hasRequiredDe = 1;
    	(function (exports) {
    		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    		    return (mod && mod.__esModule) ? mod : { "default": mod };
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
    		const configurations_1 = requireConfigurations();
    		const chrono_1 = requireChrono();
    		const SlashDateFormatParser_1 = __importDefault(SlashDateFormatParser$1);
    		const ISOFormatParser_1 = __importDefault(ISOFormatParser$1);
    		const DETimeExpressionParser_1 = __importDefault(requireDETimeExpressionParser());
    		const DEWeekdayParser_1 = __importDefault(requireDEWeekdayParser());
    		const DESpecificTimeExpressionParser_1 = __importDefault(requireDESpecificTimeExpressionParser());
    		const DEMergeDateRangeRefiner_1 = __importDefault(DEMergeDateRangeRefiner$1);
    		const DEMergeDateTimeRefiner_1 = __importDefault(requireDEMergeDateTimeRefiner());
    		const DECasualDateParser_1 = __importDefault(requireDECasualDateParser());
    		const DECasualTimeParser_1 = __importDefault(requireDECasualTimeParser());
    		const DEMonthNameLittleEndianParser_1 = __importDefault(DEMonthNameLittleEndianParser$1);
    		const DETimeUnitRelativeFormatParser_1 = __importDefault(requireDETimeUnitRelativeFormatParser());
    		const DETimeUnitWithinFormatParser_1 = __importDefault(requireDETimeUnitWithinFormatParser());
    		exports.casual = new chrono_1.Chrono(createCasualConfiguration());
    		exports.strict = new chrono_1.Chrono(createConfiguration(true));
    		function parse(text, ref, option) {
    		    return exports.casual.parse(text, ref, option);
    		}
    		exports.parse = parse;
    		function parseDate(text, ref, option) {
    		    return exports.casual.parseDate(text, ref, option);
    		}
    		exports.parseDate = parseDate;
    		function createCasualConfiguration(littleEndian = true) {
    		    const option = createConfiguration(false, littleEndian);
    		    option.parsers.unshift(new DECasualTimeParser_1.default());
    		    option.parsers.unshift(new DECasualDateParser_1.default());
    		    option.parsers.unshift(new DETimeUnitRelativeFormatParser_1.default());
    		    return option;
    		}
    		exports.createCasualConfiguration = createCasualConfiguration;
    		function createConfiguration(strictMode = true, littleEndian = true) {
    		    return configurations_1.includeCommonConfiguration({
    		        parsers: [
    		            new ISOFormatParser_1.default(),
    		            new SlashDateFormatParser_1.default(littleEndian),
    		            new DETimeExpressionParser_1.default(),
    		            new DESpecificTimeExpressionParser_1.default(),
    		            new DEMonthNameLittleEndianParser_1.default(),
    		            new DEWeekdayParser_1.default(),
    		            new DETimeUnitWithinFormatParser_1.default(),
    		        ],
    		        refiners: [new DEMergeDateRangeRefiner_1.default(), new DEMergeDateTimeRefiner_1.default()],
    		    }, strictMode);
    		}
    		exports.createConfiguration = createConfiguration;
    		
    } (de));
    	return de;
    }

    var fr = {};

    var FRCasualDateParser = {};

    var hasRequiredFRCasualDateParser;

    function requireFRCasualDateParser () {
    	if (hasRequiredFRCasualDateParser) return FRCasualDateParser;
    	hasRequiredFRCasualDateParser = 1;
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(FRCasualDateParser, "__esModule", { value: true });
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const index_1 = requireDist();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const dayjs_2 = requireDayjs();
    	const references = __importStar(requireCasualReferences());
    	let FRCasualDateParser$1 = class FRCasualDateParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern(context) {
    	        return /(maintenant|aujourd'hui|demain|hier|cette\s*nuit|la\s*veille)(?=\W|$)/i;
    	    }
    	    innerExtract(context, match) {
    	        let targetDate = dayjs_1.default(context.refDate);
    	        const lowerText = match[0].toLowerCase();
    	        const component = context.createParsingComponents();
    	        switch (lowerText) {
    	            case "maintenant":
    	                return references.now(context.reference);
    	            case "aujourd'hui":
    	                return references.today(context.reference);
    	            case "hier":
    	                return references.yesterday(context.reference);
    	            case "demain":
    	                return references.tomorrow(context.reference);
    	            default:
    	                if (lowerText.match(/cette\s*nuit/)) {
    	                    dayjs_2.assignSimilarDate(component, targetDate);
    	                    component.imply("hour", 22);
    	                    component.imply("meridiem", index_1.Meridiem.PM);
    	                }
    	                else if (lowerText.match(/la\s*veille/)) {
    	                    targetDate = targetDate.add(-1, "day");
    	                    dayjs_2.assignSimilarDate(component, targetDate);
    	                    component.imply("hour", 0);
    	                }
    	        }
    	        return component;
    	    }
    	};
    	FRCasualDateParser.default = FRCasualDateParser$1;
    	
    	return FRCasualDateParser;
    }

    var FRCasualTimeParser = {};

    var hasRequiredFRCasualTimeParser;

    function requireFRCasualTimeParser () {
    	if (hasRequiredFRCasualTimeParser) return FRCasualTimeParser;
    	hasRequiredFRCasualTimeParser = 1;
    	Object.defineProperty(FRCasualTimeParser, "__esModule", { value: true });
    	const index_1 = requireDist();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	let FRCasualTimeParser$1 = class FRCasualTimeParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern(context) {
    	        return /(cet?)?\s*(matin|soir|après-midi|aprem|a midi|à minuit)(?=\W|$)/i;
    	    }
    	    innerExtract(context, match) {
    	        const suffixLower = match[2].toLowerCase();
    	        const component = context.createParsingComponents();
    	        switch (suffixLower) {
    	            case "après-midi":
    	            case "aprem":
    	                component.imply("hour", 14);
    	                component.imply("minute", 0);
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                break;
    	            case "soir":
    	                component.imply("hour", 18);
    	                component.imply("minute", 0);
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                break;
    	            case "matin":
    	                component.imply("hour", 8);
    	                component.imply("minute", 0);
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                break;
    	            case "a midi":
    	                component.imply("hour", 12);
    	                component.imply("minute", 0);
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                break;
    	            case "à minuit":
    	                component.imply("hour", 0);
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                break;
    	        }
    	        return component;
    	    }
    	};
    	FRCasualTimeParser.default = FRCasualTimeParser$1;
    	
    	return FRCasualTimeParser;
    }

    var FRTimeExpressionParser = {};

    var hasRequiredFRTimeExpressionParser;

    function requireFRTimeExpressionParser () {
    	if (hasRequiredFRTimeExpressionParser) return FRTimeExpressionParser;
    	hasRequiredFRTimeExpressionParser = 1;
    	Object.defineProperty(FRTimeExpressionParser, "__esModule", { value: true });
    	const AbstractTimeExpressionParser_1 = requireAbstractTimeExpressionParser();
    	let FRTimeExpressionParser$1 = class FRTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    	    primaryPrefix() {
    	        return "(?:(?:[àa])\\s*)?";
    	    }
    	    followingPhase() {
    	        return "\\s*(?:\\-|\\–|\\~|\\〜|[àa]|\\?)\\s*";
    	    }
    	    extractPrimaryTimeComponents(context, match) {
    	        if (match[0].match(/^\s*\d{4}\s*$/)) {
    	            return null;
    	        }
    	        return super.extractPrimaryTimeComponents(context, match);
    	    }
    	};
    	FRTimeExpressionParser.default = FRTimeExpressionParser$1;
    	
    	return FRTimeExpressionParser;
    }

    var FRMergeDateTimeRefiner = {};

    var hasRequiredFRMergeDateTimeRefiner;

    function requireFRMergeDateTimeRefiner () {
    	if (hasRequiredFRMergeDateTimeRefiner) return FRMergeDateTimeRefiner;
    	hasRequiredFRMergeDateTimeRefiner = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(FRMergeDateTimeRefiner, "__esModule", { value: true });
    	const AbstractMergeDateTimeRefiner_1 = __importDefault(requireAbstractMergeDateTimeRefiner());
    	let FRMergeDateTimeRefiner$1 = class FRMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    	    patternBetween() {
    	        return new RegExp("^\\s*(T|à|a|vers|de|,|-)?\\s*$");
    	    }
    	};
    	FRMergeDateTimeRefiner.default = FRMergeDateTimeRefiner$1;
    	
    	return FRMergeDateTimeRefiner;
    }

    var FRMergeDateRangeRefiner$1 = {};

    var __importDefault$k = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(FRMergeDateRangeRefiner$1, "__esModule", { value: true });
    const AbstractMergeDateRangeRefiner_1$7 = __importDefault$k(AbstractMergeDateRangeRefiner$1);
    class FRMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$7.default {
        patternBetween() {
            return /^\s*(à|a|-)\s*$/i;
        }
    }
    FRMergeDateRangeRefiner$1.default = FRMergeDateRangeRefiner;

    var FRWeekdayParser = {};

    var constants$7 = {};

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
    	const pattern_1 = pattern;
    	exports.WEEKDAY_DICTIONARY = {
    	    "dimanche": 0,
    	    "dim": 0,
    	    "lundi": 1,
    	    "lun": 1,
    	    "mardi": 2,
    	    "mar": 2,
    	    "mercredi": 3,
    	    "mer": 3,
    	    "jeudi": 4,
    	    "jeu": 4,
    	    "vendredi": 5,
    	    "ven": 5,
    	    "samedi": 6,
    	    "sam": 6,
    	};
    	exports.MONTH_DICTIONARY = {
    	    "janvier": 1,
    	    "jan": 1,
    	    "jan.": 1,
    	    "février": 2,
    	    "fév": 2,
    	    "fév.": 2,
    	    "fevrier": 2,
    	    "fev": 2,
    	    "fev.": 2,
    	    "mars": 3,
    	    "mar": 3,
    	    "mar.": 3,
    	    "avril": 4,
    	    "avr": 4,
    	    "avr.": 4,
    	    "mai": 5,
    	    "juin": 6,
    	    "jun": 6,
    	    "juillet": 7,
    	    "juil": 7,
    	    "jul": 7,
    	    "jul.": 7,
    	    "août": 8,
    	    "aout": 8,
    	    "septembre": 9,
    	    "sep": 9,
    	    "sep.": 9,
    	    "sept": 9,
    	    "sept.": 9,
    	    "octobre": 10,
    	    "oct": 10,
    	    "oct.": 10,
    	    "novembre": 11,
    	    "nov": 11,
    	    "nov.": 11,
    	    "décembre": 12,
    	    "decembre": 12,
    	    "dec": 12,
    	    "dec.": 12,
    	};
    	exports.INTEGER_WORD_DICTIONARY = {
    	    "un": 1,
    	    "deux": 2,
    	    "trois": 3,
    	    "quatre": 4,
    	    "cinq": 5,
    	    "six": 6,
    	    "sept": 7,
    	    "huit": 8,
    	    "neuf": 9,
    	    "dix": 10,
    	    "onze": 11,
    	    "douze": 12,
    	    "treize": 13,
    	};
    	exports.TIME_UNIT_DICTIONARY = {
    	    "sec": "second",
    	    "seconde": "second",
    	    "secondes": "second",
    	    "min": "minute",
    	    "mins": "minute",
    	    "minute": "minute",
    	    "minutes": "minute",
    	    "h": "hour",
    	    "hr": "hour",
    	    "hrs": "hour",
    	    "heure": "hour",
    	    "heures": "hour",
    	    "jour": "d",
    	    "jours": "d",
    	    "semaine": "week",
    	    "semaines": "week",
    	    "mois": "month",
    	    "trimestre": "quarter",
    	    "trimestres": "quarter",
    	    "ans": "year",
    	    "année": "year",
    	    "années": "year",
    	};
    	exports.NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|une?\\b|quelques?|demi-?)`;
    	function parseNumberPattern(match) {
    	    const num = match.toLowerCase();
    	    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
    	        return exports.INTEGER_WORD_DICTIONARY[num];
    	    }
    	    else if (num === "une" || num === "un") {
    	        return 1;
    	    }
    	    else if (num.match(/quelques?/)) {
    	        return 3;
    	    }
    	    else if (num.match(/demi-?/)) {
    	        return 0.5;
    	    }
    	    return parseFloat(num);
    	}
    	exports.parseNumberPattern = parseNumberPattern;
    	exports.ORDINAL_NUMBER_PATTERN = `(?:[0-9]{1,2}(?:er)?)`;
    	function parseOrdinalNumberPattern(match) {
    	    let num = match.toLowerCase();
    	    num = num.replace(/(?:er)$/i, "");
    	    return parseInt(num);
    	}
    	exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
    	exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:AC|AD|p\\.\\s*C(?:hr?)?\\.\\s*n\\.)|[1-2][0-9]{3}|[5-9][0-9])`;
    	function parseYear(match) {
    	    if (/AC/i.test(match)) {
    	        match = match.replace(/BC/i, "");
    	        return -parseInt(match);
    	    }
    	    if (/AD/i.test(match) || /C/i.test(match)) {
    	        match = match.replace(/[^\d]+/i, "");
    	        return parseInt(match);
    	    }
    	    let yearNumber = parseInt(match);
    	    if (yearNumber < 100) {
    	        if (yearNumber > 50) {
    	            yearNumber = yearNumber + 1900;
    	        }
    	        else {
    	            yearNumber = yearNumber + 2000;
    	        }
    	    }
    	    return yearNumber;
    	}
    	exports.parseYear = parseYear;
    	const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
    	const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
    	exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
    	function parseTimeUnits(timeunitText) {
    	    const fragments = {};
    	    let remainingText = timeunitText;
    	    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    while (match) {
    	        collectDateTimeFragment(fragments, match);
    	        remainingText = remainingText.substring(match[0].length);
    	        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    }
    	    return fragments;
    	}
    	exports.parseTimeUnits = parseTimeUnits;
    	function collectDateTimeFragment(fragments, match) {
    	    const num = parseNumberPattern(match[1]);
    	    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    	    fragments[unit] = num;
    	}
    	
    } (constants$7));

    var hasRequiredFRWeekdayParser;

    function requireFRWeekdayParser () {
    	if (hasRequiredFRWeekdayParser) return FRWeekdayParser;
    	hasRequiredFRWeekdayParser = 1;
    	Object.defineProperty(FRWeekdayParser, "__esModule", { value: true });
    	const constants_1 = constants$7;
    	const pattern_1 = pattern;
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const weekdays_1 = requireWeekdays();
    	const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    	    "(?:(?:ce)\\s*)?" +
    	    `(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})` +
    	    "(?:\\s*(?:\\,|\\)|\\）))?" +
    	    "(?:\\s*(dernier|prochain)\\s*)?" +
    	    "(?=\\W|\\d|$)", "i");
    	const WEEKDAY_GROUP = 1;
    	const POSTFIX_GROUP = 2;
    	let FRWeekdayParser$1 = class FRWeekdayParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
    	        const weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
    	        if (weekday === undefined) {
    	            return null;
    	        }
    	        let suffix = match[POSTFIX_GROUP];
    	        suffix = suffix || "";
    	        suffix = suffix.toLowerCase();
    	        let modifier = null;
    	        if (suffix == "dernier") {
    	            modifier = "last";
    	        }
    	        else if (suffix == "prochain") {
    	            modifier = "next";
    	        }
    	        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    	    }
    	};
    	FRWeekdayParser.default = FRWeekdayParser$1;
    	
    	return FRWeekdayParser;
    }

    var FRSpecificTimeExpressionParser = {};

    var hasRequiredFRSpecificTimeExpressionParser;

    function requireFRSpecificTimeExpressionParser () {
    	if (hasRequiredFRSpecificTimeExpressionParser) return FRSpecificTimeExpressionParser;
    	hasRequiredFRSpecificTimeExpressionParser = 1;
    	Object.defineProperty(FRSpecificTimeExpressionParser, "__esModule", { value: true });
    	const index_1 = requireDist();
    	const FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" +
    	    "(?:(?:[àa])\\s*)?" +
    	    "(\\d{1,2})(?:h|:)?" +
    	    "(?:(\\d{1,2})(?:m|:)?)?" +
    	    "(?:(\\d{1,2})(?:s|:)?)?" +
    	    "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" +
    	    "(?=\\W|$)", "i");
    	const SECOND_REG_PATTERN = new RegExp("^\\s*(\\-|\\–|\\~|\\〜|[àa]|\\?)\\s*" +
    	    "(\\d{1,2})(?:h|:)?" +
    	    "(?:(\\d{1,2})(?:m|:)?)?" +
    	    "(?:(\\d{1,2})(?:s|:)?)?" +
    	    "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" +
    	    "(?=\\W|$)", "i");
    	const HOUR_GROUP = 2;
    	const MINUTE_GROUP = 3;
    	const SECOND_GROUP = 4;
    	const AM_PM_HOUR_GROUP = 5;
    	let FRSpecificTimeExpressionParser$1 = class FRSpecificTimeExpressionParser {
    	    pattern(context) {
    	        return FIRST_REG_PATTERN;
    	    }
    	    extract(context, match) {
    	        const result = context.createParsingResult(match.index + match[1].length, match[0].substring(match[1].length));
    	        if (result.text.match(/^\d{4}$/)) {
    	            match.index += match[0].length;
    	            return null;
    	        }
    	        result.start = FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), match);
    	        if (!result.start) {
    	            match.index += match[0].length;
    	            return null;
    	        }
    	        const remainingText = context.text.substring(match.index + match[0].length);
    	        const secondMatch = SECOND_REG_PATTERN.exec(remainingText);
    	        if (secondMatch) {
    	            result.end = FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), secondMatch);
    	            if (result.end) {
    	                result.text += secondMatch[0];
    	            }
    	        }
    	        return result;
    	    }
    	    static extractTimeComponent(extractingComponents, match) {
    	        let hour = 0;
    	        let minute = 0;
    	        let meridiem = null;
    	        hour = parseInt(match[HOUR_GROUP]);
    	        if (match[MINUTE_GROUP] != null) {
    	            minute = parseInt(match[MINUTE_GROUP]);
    	        }
    	        if (minute >= 60 || hour > 24) {
    	            return null;
    	        }
    	        if (hour >= 12) {
    	            meridiem = index_1.Meridiem.PM;
    	        }
    	        if (match[AM_PM_HOUR_GROUP] != null) {
    	            if (hour > 12)
    	                return null;
    	            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
    	            if (ampm == "a") {
    	                meridiem = index_1.Meridiem.AM;
    	                if (hour == 12) {
    	                    hour = 0;
    	                }
    	            }
    	            if (ampm == "p") {
    	                meridiem = index_1.Meridiem.PM;
    	                if (hour != 12) {
    	                    hour += 12;
    	                }
    	            }
    	        }
    	        extractingComponents.assign("hour", hour);
    	        extractingComponents.assign("minute", minute);
    	        if (meridiem !== null) {
    	            extractingComponents.assign("meridiem", meridiem);
    	        }
    	        else {
    	            if (hour < 12) {
    	                extractingComponents.imply("meridiem", index_1.Meridiem.AM);
    	            }
    	            else {
    	                extractingComponents.imply("meridiem", index_1.Meridiem.PM);
    	            }
    	        }
    	        if (match[SECOND_GROUP] != null) {
    	            const second = parseInt(match[SECOND_GROUP]);
    	            if (second >= 60)
    	                return null;
    	            extractingComponents.assign("second", second);
    	        }
    	        return extractingComponents;
    	    }
    	};
    	FRSpecificTimeExpressionParser.default = FRSpecificTimeExpressionParser$1;
    	
    	return FRSpecificTimeExpressionParser;
    }

    var FRMonthNameLittleEndianParser$1 = {};

    Object.defineProperty(FRMonthNameLittleEndianParser$1, "__esModule", { value: true });
    const years_1$7 = years;
    const constants_1$i = constants$7;
    const constants_2$6 = constants$7;
    const constants_3$2 = constants$7;
    const pattern_1$7 = pattern;
    const AbstractParserWithWordBoundary_1$k = AbstractParserWithWordBoundary;
    const PATTERN$f = new RegExp("(?:on\\s*?)?" +
        `(${constants_3$2.ORDINAL_NUMBER_PATTERN})` +
        `(?:\\s*(?:au|\\-|\\–|jusqu'au?|\\s)\\s*(${constants_3$2.ORDINAL_NUMBER_PATTERN}))?` +
        `(?:-|/|\\s*(?:de)?\\s*)` +
        `(${pattern_1$7.matchAnyPattern(constants_1$i.MONTH_DICTIONARY)})` +
        `(?:(?:-|/|,?\\s*)(${constants_2$6.YEAR_PATTERN}(?![^\\s]\\d)))?` +
        `(?=\\W|$)`, "i");
    const DATE_GROUP$4 = 1;
    const DATE_TO_GROUP$4 = 2;
    const MONTH_NAME_GROUP$7 = 3;
    const YEAR_GROUP$9 = 4;
    class FRMonthNameLittleEndianParser extends AbstractParserWithWordBoundary_1$k.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$f;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            const month = constants_1$i.MONTH_DICTIONARY[match[MONTH_NAME_GROUP$7].toLowerCase()];
            const day = constants_3$2.parseOrdinalNumberPattern(match[DATE_GROUP$4]);
            if (day > 31) {
                match.index = match.index + match[DATE_GROUP$4].length;
                return null;
            }
            result.start.assign("month", month);
            result.start.assign("day", day);
            if (match[YEAR_GROUP$9]) {
                const yearNumber = constants_2$6.parseYear(match[YEAR_GROUP$9]);
                result.start.assign("year", yearNumber);
            }
            else {
                const year = years_1$7.findYearClosestToRef(context.refDate, day, month);
                result.start.imply("year", year);
            }
            if (match[DATE_TO_GROUP$4]) {
                const endDate = constants_3$2.parseOrdinalNumberPattern(match[DATE_TO_GROUP$4]);
                result.end = result.start.clone();
                result.end.assign("day", endDate);
            }
            return result;
        }
    }
    FRMonthNameLittleEndianParser$1.default = FRMonthNameLittleEndianParser;

    var FRTimeUnitAgoFormatParser = {};

    var hasRequiredFRTimeUnitAgoFormatParser;

    function requireFRTimeUnitAgoFormatParser () {
    	if (hasRequiredFRTimeUnitAgoFormatParser) return FRTimeUnitAgoFormatParser;
    	hasRequiredFRTimeUnitAgoFormatParser = 1;
    	Object.defineProperty(FRTimeUnitAgoFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$7;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const timeunits_1 = timeunits;
    	let FRTimeUnitAgoFormatParser$1 = class FRTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    constructor() {
    	        super();
    	    }
    	    innerPattern() {
    	        return new RegExp(`il y a\\s*(${constants_1.TIME_UNITS_PATTERN})(?=(?:\\W|$))`, "i");
    	    }
    	    innerExtract(context, match) {
    	        const timeUnits = constants_1.parseTimeUnits(match[1]);
    	        const outputTimeUnits = timeunits_1.reverseTimeUnits(timeUnits);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
    	    }
    	};
    	FRTimeUnitAgoFormatParser.default = FRTimeUnitAgoFormatParser$1;
    	
    	return FRTimeUnitAgoFormatParser;
    }

    var FRTimeUnitWithinFormatParser = {};

    var hasRequiredFRTimeUnitWithinFormatParser;

    function requireFRTimeUnitWithinFormatParser () {
    	if (hasRequiredFRTimeUnitWithinFormatParser) return FRTimeUnitWithinFormatParser;
    	hasRequiredFRTimeUnitWithinFormatParser = 1;
    	Object.defineProperty(FRTimeUnitWithinFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$7;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	let FRTimeUnitWithinFormatParser$1 = class FRTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return new RegExp(`(?:dans|en|pour|pendant|de)\\s*(${constants_1.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    	    }
    	    innerExtract(context, match) {
    	        const timeUnits = constants_1.parseTimeUnits(match[1]);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	    }
    	};
    	FRTimeUnitWithinFormatParser.default = FRTimeUnitWithinFormatParser$1;
    	
    	return FRTimeUnitWithinFormatParser;
    }

    var FRTimeUnitRelativeFormatParser = {};

    var hasRequiredFRTimeUnitRelativeFormatParser;

    function requireFRTimeUnitRelativeFormatParser () {
    	if (hasRequiredFRTimeUnitRelativeFormatParser) return FRTimeUnitRelativeFormatParser;
    	hasRequiredFRTimeUnitRelativeFormatParser = 1;
    	Object.defineProperty(FRTimeUnitRelativeFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$7;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const timeunits_1 = timeunits;
    	const pattern_1 = pattern;
    	class FRTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    constructor() {
    	        super();
    	    }
    	    innerPattern() {
    	        return new RegExp(`(?:les?|la|l'|du|des?)\\s*` +
    	            `(${constants_1.NUMBER_PATTERN})?` +
    	            `(?:\\s*(prochaine?s?|derni[eè]re?s?|pass[ée]e?s?|pr[ée]c[ée]dents?|suivante?s?))?` +
    	            `\\s*(${pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY)})` +
    	            `(?:\\s*(prochaine?s?|derni[eè]re?s?|pass[ée]e?s?|pr[ée]c[ée]dents?|suivante?s?))?`, "i");
    	    }
    	    innerExtract(context, match) {
    	        const num = match[1] ? constants_1.parseNumberPattern(match[1]) : 1;
    	        const unit = constants_1.TIME_UNIT_DICTIONARY[match[3].toLowerCase()];
    	        let timeUnits = {};
    	        timeUnits[unit] = num;
    	        let modifier = match[2] || match[4] || "";
    	        modifier = modifier.toLowerCase();
    	        if (!modifier) {
    	            return;
    	        }
    	        if (/derni[eè]re?s?/.test(modifier) || /pass[ée]e?s?/.test(modifier) || /pr[ée]c[ée]dents?/.test(modifier)) {
    	            timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
    	        }
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	    }
    	}
    	FRTimeUnitRelativeFormatParser.default = FRTimeUnitAgoFormatParser;
    	
    	return FRTimeUnitRelativeFormatParser;
    }

    var hasRequiredFr;

    function requireFr () {
    	if (hasRequiredFr) return fr;
    	hasRequiredFr = 1;
    	(function (exports) {
    		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    		    return (mod && mod.__esModule) ? mod : { "default": mod };
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
    		const configurations_1 = requireConfigurations();
    		const chrono_1 = requireChrono();
    		const FRCasualDateParser_1 = __importDefault(requireFRCasualDateParser());
    		const FRCasualTimeParser_1 = __importDefault(requireFRCasualTimeParser());
    		const SlashDateFormatParser_1 = __importDefault(SlashDateFormatParser$1);
    		const FRTimeExpressionParser_1 = __importDefault(requireFRTimeExpressionParser());
    		const FRMergeDateTimeRefiner_1 = __importDefault(requireFRMergeDateTimeRefiner());
    		const FRMergeDateRangeRefiner_1 = __importDefault(FRMergeDateRangeRefiner$1);
    		const FRWeekdayParser_1 = __importDefault(requireFRWeekdayParser());
    		const FRSpecificTimeExpressionParser_1 = __importDefault(requireFRSpecificTimeExpressionParser());
    		const FRMonthNameLittleEndianParser_1 = __importDefault(FRMonthNameLittleEndianParser$1);
    		const FRTimeUnitAgoFormatParser_1 = __importDefault(requireFRTimeUnitAgoFormatParser());
    		const FRTimeUnitWithinFormatParser_1 = __importDefault(requireFRTimeUnitWithinFormatParser());
    		const FRTimeUnitRelativeFormatParser_1 = __importDefault(requireFRTimeUnitRelativeFormatParser());
    		exports.casual = new chrono_1.Chrono(createCasualConfiguration());
    		exports.strict = new chrono_1.Chrono(createConfiguration(true));
    		function parse(text, ref, option) {
    		    return exports.casual.parse(text, ref, option);
    		}
    		exports.parse = parse;
    		function parseDate(text, ref, option) {
    		    return exports.casual.parseDate(text, ref, option);
    		}
    		exports.parseDate = parseDate;
    		function createCasualConfiguration(littleEndian = true) {
    		    const option = createConfiguration(false, littleEndian);
    		    option.parsers.unshift(new FRCasualDateParser_1.default());
    		    option.parsers.unshift(new FRCasualTimeParser_1.default());
    		    option.parsers.unshift(new FRTimeUnitRelativeFormatParser_1.default());
    		    return option;
    		}
    		exports.createCasualConfiguration = createCasualConfiguration;
    		function createConfiguration(strictMode = true, littleEndian = true) {
    		    return configurations_1.includeCommonConfiguration({
    		        parsers: [
    		            new SlashDateFormatParser_1.default(littleEndian),
    		            new FRMonthNameLittleEndianParser_1.default(),
    		            new FRTimeExpressionParser_1.default(),
    		            new FRSpecificTimeExpressionParser_1.default(),
    		            new FRTimeUnitAgoFormatParser_1.default(),
    		            new FRTimeUnitWithinFormatParser_1.default(),
    		            new FRWeekdayParser_1.default(),
    		        ],
    		        refiners: [new FRMergeDateTimeRefiner_1.default(), new FRMergeDateRangeRefiner_1.default()],
    		    }, strictMode);
    		}
    		exports.createConfiguration = createConfiguration;
    		
    } (fr));
    	return fr;
    }

    var ja = {};

    var JPStandardParser$1 = {};

    var constants$6 = {};

    Object.defineProperty(constants$6, "__esModule", { value: true });
    constants$6.toHankaku = void 0;
    function toHankaku(text) {
        return String(text)
            .replace(/\u2019/g, "\u0027")
            .replace(/\u201D/g, "\u0022")
            .replace(/\u3000/g, "\u0020")
            .replace(/\uFFE5/g, "\u00A5")
            .replace(/[\uFF01\uFF03-\uFF06\uFF08\uFF09\uFF0C-\uFF19\uFF1C-\uFF1F\uFF21-\uFF3B\uFF3D\uFF3F\uFF41-\uFF5B\uFF5D\uFF5E]/g, alphaNum);
    }
    constants$6.toHankaku = toHankaku;
    function alphaNum(token) {
        return String.fromCharCode(token.charCodeAt(0) - 65248);
    }

    var __importDefault$j = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(JPStandardParser$1, "__esModule", { value: true });
    const constants_1$h = constants$6;
    const years_1$6 = years;
    const dayjs_1$c = __importDefault$j(dayjs_minExports);
    const PATTERN$e = /(?:(?:([同今本])|((昭和|平成|令和)?([0-9０-９]{1,4}|元)))年\s*)?([0-9０-９]{1,2})月\s*([0-9０-９]{1,2})日/i;
    const SPECIAL_YEAR_GROUP = 1;
    const TYPICAL_YEAR_GROUP = 2;
    const ERA_GROUP = 3;
    const YEAR_NUMBER_GROUP$1 = 4;
    const MONTH_GROUP$3 = 5;
    const DAY_GROUP$2 = 6;
    class JPStandardParser {
        pattern() {
            return PATTERN$e;
        }
        extract(context, match) {
            const month = parseInt(constants_1$h.toHankaku(match[MONTH_GROUP$3]));
            const day = parseInt(constants_1$h.toHankaku(match[DAY_GROUP$2]));
            const components = context.createParsingComponents({
                day: day,
                month: month,
            });
            if (match[SPECIAL_YEAR_GROUP] && match[SPECIAL_YEAR_GROUP].match("同|今|本")) {
                const moment = dayjs_1$c.default(context.refDate);
                components.assign("year", moment.year());
            }
            if (match[TYPICAL_YEAR_GROUP]) {
                const yearNumText = match[YEAR_NUMBER_GROUP$1];
                let year = yearNumText == "元" ? 1 : parseInt(constants_1$h.toHankaku(yearNumText));
                if (match[ERA_GROUP] == "令和") {
                    year += 2018;
                }
                else if (match[ERA_GROUP] == "平成") {
                    year += 1988;
                }
                else if (match[ERA_GROUP] == "昭和") {
                    year += 1925;
                }
                components.assign("year", year);
            }
            else {
                const year = years_1$6.findYearClosestToRef(context.refDate, day, month);
                components.imply("year", year);
            }
            return components;
        }
    }
    JPStandardParser$1.default = JPStandardParser;

    var JPMergeDateRangeRefiner$1 = {};

    var __importDefault$i = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(JPMergeDateRangeRefiner$1, "__esModule", { value: true });
    const AbstractMergeDateRangeRefiner_1$6 = __importDefault$i(AbstractMergeDateRangeRefiner$1);
    class JPMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$6.default {
        patternBetween() {
            return /^\s*(から|ー|-)\s*$/i;
        }
    }
    JPMergeDateRangeRefiner$1.default = JPMergeDateRangeRefiner;

    var JPCasualDateParser = {};

    var hasRequiredJPCasualDateParser;

    function requireJPCasualDateParser () {
    	if (hasRequiredJPCasualDateParser) return JPCasualDateParser;
    	hasRequiredJPCasualDateParser = 1;
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(JPCasualDateParser, "__esModule", { value: true });
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const index_1 = requireDist();
    	const references = __importStar(requireCasualReferences());
    	const PATTERN = /今日|当日|昨日|明日|今夜|今夕|今晩|今朝/i;
    	let JPCasualDateParser$1 = class JPCasualDateParser {
    	    pattern() {
    	        return PATTERN;
    	    }
    	    extract(context, match) {
    	        const text = match[0];
    	        const date = dayjs_1.default(context.refDate);
    	        const components = context.createParsingComponents();
    	        switch (text) {
    	            case "昨日":
    	                return references.yesterday(context.reference);
    	            case "明日":
    	                return references.tomorrow(context.reference);
    	            case "今日":
    	            case "当日":
    	                return references.today(context.reference);
    	        }
    	        if (text == "今夜" || text == "今夕" || text == "今晩") {
    	            components.imply("hour", 22);
    	            components.assign("meridiem", index_1.Meridiem.PM);
    	        }
    	        else if (text.match("今朝")) {
    	            components.imply("hour", 6);
    	            components.assign("meridiem", index_1.Meridiem.AM);
    	        }
    	        components.assign("day", date.date());
    	        components.assign("month", date.month() + 1);
    	        components.assign("year", date.year());
    	        return components;
    	    }
    	};
    	JPCasualDateParser.default = JPCasualDateParser$1;
    	
    	return JPCasualDateParser;
    }

    var hasRequiredJa;

    function requireJa () {
    	if (hasRequiredJa) return ja;
    	hasRequiredJa = 1;
    	(function (exports) {
    		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    		    return (mod && mod.__esModule) ? mod : { "default": mod };
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
    		const JPStandardParser_1 = __importDefault(JPStandardParser$1);
    		const JPMergeDateRangeRefiner_1 = __importDefault(JPMergeDateRangeRefiner$1);
    		const JPCasualDateParser_1 = __importDefault(requireJPCasualDateParser());
    		const chrono_1 = requireChrono();
    		exports.casual = new chrono_1.Chrono(createCasualConfiguration());
    		exports.strict = new chrono_1.Chrono(createConfiguration());
    		function parse(text, ref, option) {
    		    return exports.casual.parse(text, ref, option);
    		}
    		exports.parse = parse;
    		function parseDate(text, ref, option) {
    		    return exports.casual.parseDate(text, ref, option);
    		}
    		exports.parseDate = parseDate;
    		function createCasualConfiguration() {
    		    const option = createConfiguration();
    		    option.parsers.unshift(new JPCasualDateParser_1.default());
    		    return option;
    		}
    		exports.createCasualConfiguration = createCasualConfiguration;
    		function createConfiguration() {
    		    return {
    		        parsers: [new JPStandardParser_1.default()],
    		        refiners: [new JPMergeDateRangeRefiner_1.default()],
    		    };
    		}
    		exports.createConfiguration = createConfiguration;
    		
    } (ja));
    	return ja;
    }

    var pt = {};

    var PTWeekdayParser = {};

    var constants$5 = {};

    Object.defineProperty(constants$5, "__esModule", { value: true });
    constants$5.parseYear = constants$5.YEAR_PATTERN = constants$5.MONTH_DICTIONARY = constants$5.WEEKDAY_DICTIONARY = void 0;
    constants$5.WEEKDAY_DICTIONARY = {
        "domingo": 0,
        "dom": 0,
        "segunda": 1,
        "segunda-feira": 1,
        "seg": 1,
        "terça": 2,
        "terça-feira": 2,
        "ter": 2,
        "quarta": 3,
        "quarta-feira": 3,
        "qua": 3,
        "quinta": 4,
        "quinta-feira": 4,
        "qui": 4,
        "sexta": 5,
        "sexta-feira": 5,
        "sex": 5,
        "sábado": 6,
        "sabado": 6,
        "sab": 6,
    };
    constants$5.MONTH_DICTIONARY = {
        "janeiro": 1,
        "jan": 1,
        "jan.": 1,
        "fevereiro": 2,
        "fev": 2,
        "fev.": 2,
        "março": 3,
        "mar": 3,
        "mar.": 3,
        "abril": 4,
        "abr": 4,
        "abr.": 4,
        "maio": 5,
        "mai": 5,
        "mai.": 5,
        "junho": 6,
        "jun": 6,
        "jun.": 6,
        "julho": 7,
        "jul": 7,
        "jul.": 7,
        "agosto": 8,
        "ago": 8,
        "ago.": 8,
        "setembro": 9,
        "set": 9,
        "set.": 9,
        "outubro": 10,
        "out": 10,
        "out.": 10,
        "novembro": 11,
        "nov": 11,
        "nov.": 11,
        "dezembro": 12,
        "dez": 12,
        "dez.": 12,
    };
    constants$5.YEAR_PATTERN = "[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?";
    function parseYear(match) {
        if (match.match(/^[0-9]{1,4}$/)) {
            let yearNumber = parseInt(match);
            if (yearNumber < 100) {
                if (yearNumber > 50) {
                    yearNumber = yearNumber + 1900;
                }
                else {
                    yearNumber = yearNumber + 2000;
                }
            }
            return yearNumber;
        }
        if (match.match(/a\.?\s*c\.?/i)) {
            match = match.replace(/a\.?\s*c\.?/i, "");
            return -parseInt(match);
        }
        return parseInt(match);
    }
    constants$5.parseYear = parseYear;

    var hasRequiredPTWeekdayParser;

    function requirePTWeekdayParser () {
    	if (hasRequiredPTWeekdayParser) return PTWeekdayParser;
    	hasRequiredPTWeekdayParser = 1;
    	Object.defineProperty(PTWeekdayParser, "__esModule", { value: true });
    	const constants_1 = constants$5;
    	const pattern_1 = pattern;
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const weekdays_1 = requireWeekdays();
    	const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    	    "(?:(este|esta|passado|pr[oó]ximo)\\s*)?" +
    	    `(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})` +
    	    "(?:\\s*(?:\\,|\\)|\\）))?" +
    	    "(?:\\s*(este|esta|passado|pr[óo]ximo)\\s*semana)?" +
    	    "(?=\\W|\\d|$)", "i");
    	const PREFIX_GROUP = 1;
    	const WEEKDAY_GROUP = 2;
    	const POSTFIX_GROUP = 3;
    	let PTWeekdayParser$1 = class PTWeekdayParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
    	        const weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
    	        if (weekday === undefined) {
    	            return null;
    	        }
    	        const prefix = match[PREFIX_GROUP];
    	        const postfix = match[POSTFIX_GROUP];
    	        let norm = prefix || postfix || "";
    	        norm = norm.toLowerCase();
    	        let modifier = null;
    	        if (norm == "passado") {
    	            modifier = "this";
    	        }
    	        else if (norm == "próximo" || norm == "proximo") {
    	            modifier = "next";
    	        }
    	        else if (norm == "este") {
    	            modifier = "this";
    	        }
    	        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    	    }
    	};
    	PTWeekdayParser.default = PTWeekdayParser$1;
    	
    	return PTWeekdayParser;
    }

    var PTTimeExpressionParser = {};

    var hasRequiredPTTimeExpressionParser;

    function requirePTTimeExpressionParser () {
    	if (hasRequiredPTTimeExpressionParser) return PTTimeExpressionParser;
    	hasRequiredPTTimeExpressionParser = 1;
    	Object.defineProperty(PTTimeExpressionParser, "__esModule", { value: true });
    	const AbstractTimeExpressionParser_1 = requireAbstractTimeExpressionParser();
    	let PTTimeExpressionParser$1 = class PTTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    	    primaryPrefix() {
    	        return "(?:(?:ao?|às?|das|da|de|do)\\s*)?";
    	    }
    	    followingPhase() {
    	        return "\\s*(?:\\-|\\–|\\~|\\〜|a(?:o)?|\\?)\\s*";
    	    }
    	};
    	PTTimeExpressionParser.default = PTTimeExpressionParser$1;
    	
    	return PTTimeExpressionParser;
    }

    var PTMergeDateTimeRefiner = {};

    var hasRequiredPTMergeDateTimeRefiner;

    function requirePTMergeDateTimeRefiner () {
    	if (hasRequiredPTMergeDateTimeRefiner) return PTMergeDateTimeRefiner;
    	hasRequiredPTMergeDateTimeRefiner = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(PTMergeDateTimeRefiner, "__esModule", { value: true });
    	const AbstractMergeDateTimeRefiner_1 = __importDefault(requireAbstractMergeDateTimeRefiner());
    	let PTMergeDateTimeRefiner$1 = class PTMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    	    patternBetween() {
    	        return new RegExp("^\\s*(?:,|à)?\\s*$");
    	    }
    	};
    	PTMergeDateTimeRefiner.default = PTMergeDateTimeRefiner$1;
    	
    	return PTMergeDateTimeRefiner;
    }

    var PTMergeDateRangeRefiner$1 = {};

    var __importDefault$h = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(PTMergeDateRangeRefiner$1, "__esModule", { value: true });
    const AbstractMergeDateRangeRefiner_1$5 = __importDefault$h(AbstractMergeDateRangeRefiner$1);
    class PTMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$5.default {
        patternBetween() {
            return /^\s*(?:-)\s*$/i;
        }
    }
    PTMergeDateRangeRefiner$1.default = PTMergeDateRangeRefiner;

    var PTMonthNameLittleEndianParser$1 = {};

    Object.defineProperty(PTMonthNameLittleEndianParser$1, "__esModule", { value: true });
    const years_1$5 = years;
    const constants_1$g = constants$5;
    const constants_2$5 = constants$5;
    const pattern_1$6 = pattern;
    const AbstractParserWithWordBoundary_1$j = AbstractParserWithWordBoundary;
    const PATTERN$d = new RegExp(`([0-9]{1,2})(?:º|ª|°)?` +
        "(?:\\s*(?:desde|de|\\-|\\–|ao?|\\s)\\s*([0-9]{1,2})(?:º|ª|°)?)?\\s*(?:de)?\\s*" +
        `(?:-|/|\\s*(?:de|,)?\\s*)` +
        `(${pattern_1$6.matchAnyPattern(constants_1$g.MONTH_DICTIONARY)})` +
        `(?:\\s*(?:de|,)?\\s*(${constants_2$5.YEAR_PATTERN}))?` +
        `(?=\\W|$)`, "i");
    const DATE_GROUP$3 = 1;
    const DATE_TO_GROUP$3 = 2;
    const MONTH_NAME_GROUP$6 = 3;
    const YEAR_GROUP$8 = 4;
    class PTMonthNameLittleEndianParser extends AbstractParserWithWordBoundary_1$j.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$d;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            const month = constants_1$g.MONTH_DICTIONARY[match[MONTH_NAME_GROUP$6].toLowerCase()];
            const day = parseInt(match[DATE_GROUP$3]);
            if (day > 31) {
                match.index = match.index + match[DATE_GROUP$3].length;
                return null;
            }
            result.start.assign("month", month);
            result.start.assign("day", day);
            if (match[YEAR_GROUP$8]) {
                const yearNumber = constants_2$5.parseYear(match[YEAR_GROUP$8]);
                result.start.assign("year", yearNumber);
            }
            else {
                const year = years_1$5.findYearClosestToRef(context.refDate, day, month);
                result.start.imply("year", year);
            }
            if (match[DATE_TO_GROUP$3]) {
                const endDate = parseInt(match[DATE_TO_GROUP$3]);
                result.end = result.start.clone();
                result.end.assign("day", endDate);
            }
            return result;
        }
    }
    PTMonthNameLittleEndianParser$1.default = PTMonthNameLittleEndianParser;

    var PTCasualDateParser = {};

    var hasRequiredPTCasualDateParser;

    function requirePTCasualDateParser () {
    	if (hasRequiredPTCasualDateParser) return PTCasualDateParser;
    	hasRequiredPTCasualDateParser = 1;
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	Object.defineProperty(PTCasualDateParser, "__esModule", { value: true });
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const references = __importStar(requireCasualReferences());
    	let PTCasualDateParser$1 = class PTCasualDateParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern(context) {
    	        return /(agora|hoje|amanha|amanhã|ontem)(?=\W|$)/i;
    	    }
    	    innerExtract(context, match) {
    	        const lowerText = match[0].toLowerCase();
    	        const component = context.createParsingComponents();
    	        switch (lowerText) {
    	            case "agora":
    	                return references.now(context.reference);
    	            case "hoje":
    	                return references.today(context.reference);
    	            case "amanha":
    	            case "amanhã":
    	                return references.tomorrow(context.reference);
    	            case "ontem":
    	                return references.yesterday(context.reference);
    	        }
    	        return component;
    	    }
    	};
    	PTCasualDateParser.default = PTCasualDateParser$1;
    	
    	return PTCasualDateParser;
    }

    var PTCasualTimeParser = {};

    var hasRequiredPTCasualTimeParser;

    function requirePTCasualTimeParser () {
    	if (hasRequiredPTCasualTimeParser) return PTCasualTimeParser;
    	hasRequiredPTCasualTimeParser = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(PTCasualTimeParser, "__esModule", { value: true });
    	const index_1 = requireDist();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const dayjs_1 = requireDayjs();
    	const dayjs_2 = __importDefault(dayjs_minExports);
    	let PTCasualTimeParser$1 = class PTCasualTimeParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return /(?:esta\s*)?(manha|manhã|tarde|meia-noite|meio-dia|noite)(?=\W|$)/i;
    	    }
    	    innerExtract(context, match) {
    	        const targetDate = dayjs_2.default(context.refDate);
    	        const component = context.createParsingComponents();
    	        switch (match[1].toLowerCase()) {
    	            case "tarde":
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                component.imply("hour", 15);
    	                break;
    	            case "noite":
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                component.imply("hour", 22);
    	                break;
    	            case "manha":
    	            case "manhã":
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                component.imply("hour", 6);
    	                break;
    	            case "meia-noite":
    	                dayjs_1.assignTheNextDay(component, targetDate);
    	                component.imply("hour", 0);
    	                component.imply("minute", 0);
    	                component.imply("second", 0);
    	                break;
    	            case "meio-dia":
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                component.imply("hour", 12);
    	                break;
    	        }
    	        return component;
    	    }
    	};
    	PTCasualTimeParser.default = PTCasualTimeParser$1;
    	
    	return PTCasualTimeParser;
    }

    var hasRequiredPt;

    function requirePt () {
    	if (hasRequiredPt) return pt;
    	hasRequiredPt = 1;
    	(function (exports) {
    		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    		    return (mod && mod.__esModule) ? mod : { "default": mod };
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
    		const configurations_1 = requireConfigurations();
    		const chrono_1 = requireChrono();
    		const SlashDateFormatParser_1 = __importDefault(SlashDateFormatParser$1);
    		const PTWeekdayParser_1 = __importDefault(requirePTWeekdayParser());
    		const PTTimeExpressionParser_1 = __importDefault(requirePTTimeExpressionParser());
    		const PTMergeDateTimeRefiner_1 = __importDefault(requirePTMergeDateTimeRefiner());
    		const PTMergeDateRangeRefiner_1 = __importDefault(PTMergeDateRangeRefiner$1);
    		const PTMonthNameLittleEndianParser_1 = __importDefault(PTMonthNameLittleEndianParser$1);
    		const PTCasualDateParser_1 = __importDefault(requirePTCasualDateParser());
    		const PTCasualTimeParser_1 = __importDefault(requirePTCasualTimeParser());
    		exports.casual = new chrono_1.Chrono(createCasualConfiguration());
    		exports.strict = new chrono_1.Chrono(createConfiguration(true));
    		function parse(text, ref, option) {
    		    return exports.casual.parse(text, ref, option);
    		}
    		exports.parse = parse;
    		function parseDate(text, ref, option) {
    		    return exports.casual.parseDate(text, ref, option);
    		}
    		exports.parseDate = parseDate;
    		function createCasualConfiguration(littleEndian = true) {
    		    const option = createConfiguration(false, littleEndian);
    		    option.parsers.push(new PTCasualDateParser_1.default());
    		    option.parsers.push(new PTCasualTimeParser_1.default());
    		    return option;
    		}
    		exports.createCasualConfiguration = createCasualConfiguration;
    		function createConfiguration(strictMode = true, littleEndian = true) {
    		    return configurations_1.includeCommonConfiguration({
    		        parsers: [
    		            new SlashDateFormatParser_1.default(littleEndian),
    		            new PTWeekdayParser_1.default(),
    		            new PTTimeExpressionParser_1.default(),
    		            new PTMonthNameLittleEndianParser_1.default(),
    		        ],
    		        refiners: [new PTMergeDateTimeRefiner_1.default(), new PTMergeDateRangeRefiner_1.default()],
    		    }, strictMode);
    		}
    		exports.createConfiguration = createConfiguration;
    		
    } (pt));
    	return pt;
    }

    var nl = {};

    var NLMergeDateRangeRefiner$1 = {};

    var __importDefault$g = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(NLMergeDateRangeRefiner$1, "__esModule", { value: true });
    const AbstractMergeDateRangeRefiner_1$4 = __importDefault$g(AbstractMergeDateRangeRefiner$1);
    class NLMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$4.default {
        patternBetween() {
            return /^\s*(tot|-)\s*$/i;
        }
    }
    NLMergeDateRangeRefiner$1.default = NLMergeDateRangeRefiner;

    var NLMergeDateTimeRefiner = {};

    var hasRequiredNLMergeDateTimeRefiner;

    function requireNLMergeDateTimeRefiner () {
    	if (hasRequiredNLMergeDateTimeRefiner) return NLMergeDateTimeRefiner;
    	hasRequiredNLMergeDateTimeRefiner = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(NLMergeDateTimeRefiner, "__esModule", { value: true });
    	const AbstractMergeDateTimeRefiner_1 = __importDefault(requireAbstractMergeDateTimeRefiner());
    	let NLMergeDateTimeRefiner$1 = class NLMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    	    patternBetween() {
    	        return new RegExp("^\\s*(om|na|voor|in de|,|-)?\\s*$");
    	    }
    	};
    	NLMergeDateTimeRefiner.default = NLMergeDateTimeRefiner$1;
    	
    	return NLMergeDateTimeRefiner;
    }

    var NLCasualDateParser = {};

    var hasRequiredNLCasualDateParser;

    function requireNLCasualDateParser () {
    	if (hasRequiredNLCasualDateParser) return NLCasualDateParser;
    	hasRequiredNLCasualDateParser = 1;
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	Object.defineProperty(NLCasualDateParser, "__esModule", { value: true });
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const references = __importStar(requireCasualReferences());
    	let NLCasualDateParser$1 = class NLCasualDateParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern(context) {
    	        return /(nu|vandaag|morgen|morgend|gisteren)(?=\W|$)/i;
    	    }
    	    innerExtract(context, match) {
    	        const lowerText = match[0].toLowerCase();
    	        const component = context.createParsingComponents();
    	        switch (lowerText) {
    	            case "nu":
    	                return references.now(context.reference);
    	            case "vandaag":
    	                return references.today(context.reference);
    	            case "morgen":
    	            case "morgend":
    	                return references.tomorrow(context.reference);
    	            case "gisteren":
    	                return references.yesterday(context.reference);
    	        }
    	        return component;
    	    }
    	};
    	NLCasualDateParser.default = NLCasualDateParser$1;
    	
    	return NLCasualDateParser;
    }

    var NLCasualTimeParser = {};

    var hasRequiredNLCasualTimeParser;

    function requireNLCasualTimeParser () {
    	if (hasRequiredNLCasualTimeParser) return NLCasualTimeParser;
    	hasRequiredNLCasualTimeParser = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(NLCasualTimeParser, "__esModule", { value: true });
    	const index_1 = requireDist();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const dayjs_2 = requireDayjs();
    	const DAY_GROUP = 1;
    	const MOMENT_GROUP = 2;
    	let NLCasualTimeParser$1 = class NLCasualTimeParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return /(deze)?\s*(namiddag|avond|middernacht|ochtend|middag|'s middags|'s avonds|'s ochtends)(?=\W|$)/i;
    	    }
    	    innerExtract(context, match) {
    	        const targetDate = dayjs_1.default(context.refDate);
    	        const component = context.createParsingComponents();
    	        if (match[DAY_GROUP] === "deze") {
    	            component.assign("day", context.refDate.getDate());
    	            component.assign("month", context.refDate.getMonth() + 1);
    	            component.assign("year", context.refDate.getFullYear());
    	        }
    	        switch (match[MOMENT_GROUP].toLowerCase()) {
    	            case "namiddag":
    	            case "'s namiddags":
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                component.imply("hour", 15);
    	                break;
    	            case "avond":
    	            case "'s avonds'":
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                component.imply("hour", 20);
    	                break;
    	            case "middernacht":
    	                dayjs_2.assignTheNextDay(component, targetDate);
    	                component.imply("hour", 0);
    	                component.imply("minute", 0);
    	                component.imply("second", 0);
    	                break;
    	            case "ochtend":
    	            case "'s ochtends":
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                component.imply("hour", 6);
    	                break;
    	            case "middag":
    	            case "'s middags":
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                component.imply("hour", 12);
    	                break;
    	        }
    	        return component;
    	    }
    	};
    	NLCasualTimeParser.default = NLCasualTimeParser$1;
    	
    	return NLCasualTimeParser;
    }

    var NLTimeUnitWithinFormatParser = {};

    var constants$4 = {};

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
    	const pattern_1 = pattern;
    	const years_1 = years;
    	exports.WEEKDAY_DICTIONARY = {
    	    zondag: 0,
    	    zon: 0,
    	    "zon.": 0,
    	    zo: 0,
    	    "zo.": 0,
    	    maandag: 1,
    	    ma: 1,
    	    "ma.": 1,
    	    dinsdag: 2,
    	    din: 2,
    	    "din.": 2,
    	    di: 2,
    	    "di.": 2,
    	    woensdag: 3,
    	    woe: 3,
    	    "woe.": 3,
    	    wo: 3,
    	    "wo.": 3,
    	    donderdag: 4,
    	    dond: 4,
    	    "dond.": 4,
    	    do: 4,
    	    "do.": 4,
    	    vrijdag: 5,
    	    vrij: 5,
    	    "vrij.": 5,
    	    vr: 5,
    	    "vr.": 5,
    	    zaterdag: 6,
    	    zat: 6,
    	    "zat.": 6,
    	    "za": 6,
    	    "za.": 6,
    	};
    	exports.MONTH_DICTIONARY = {
    	    januari: 1,
    	    jan: 1,
    	    "jan.": 1,
    	    februari: 2,
    	    feb: 2,
    	    "feb.": 2,
    	    maart: 3,
    	    mar: 3,
    	    "mar.": 3,
    	    mrt: 3,
    	    "mrt.": 3,
    	    april: 4,
    	    apr: 4,
    	    "apr.": 4,
    	    mei: 5,
    	    juni: 6,
    	    jun: 6,
    	    "jun.": 6,
    	    juli: 7,
    	    jul: 7,
    	    "jul.": 7,
    	    augustus: 8,
    	    aug: 8,
    	    "aug.": 8,
    	    september: 9,
    	    sep: 9,
    	    "sep.": 9,
    	    sept: 9,
    	    "sept.": 9,
    	    oktober: 10,
    	    okt: 10,
    	    "okt.": 10,
    	    november: 11,
    	    nov: 11,
    	    "nov.": 11,
    	    december: 12,
    	    dec: 12,
    	    "dec.": 12,
    	};
    	exports.INTEGER_WORD_DICTIONARY = {
    	    een: 1,
    	    twee: 2,
    	    drie: 3,
    	    vier: 4,
    	    vijf: 5,
    	    zes: 6,
    	    zeven: 7,
    	    acht: 8,
    	    negen: 9,
    	    tien: 10,
    	    elf: 11,
    	    twaalf: 12,
    	};
    	exports.ORDINAL_WORD_DICTIONARY = {
    	    eerste: 1,
    	    tweede: 2,
    	    derde: 3,
    	    vierde: 4,
    	    vijfde: 5,
    	    zesde: 6,
    	    zevende: 7,
    	    achtste: 8,
    	    negende: 9,
    	    tiende: 10,
    	    elfde: 11,
    	    twaalfde: 12,
    	    dertiende: 13,
    	    veertiende: 14,
    	    vijftiende: 15,
    	    zestiende: 16,
    	    zeventiende: 17,
    	    achttiende: 18,
    	    negentiende: 19,
    	    twintigste: 20,
    	    "eenentwintigste": 21,
    	    "tweeëntwintigste": 22,
    	    "drieentwintigste": 23,
    	    "vierentwintigste": 24,
    	    "vijfentwintigste": 25,
    	    "zesentwintigste": 26,
    	    "zevenentwintigste": 27,
    	    "achtentwintig": 28,
    	    "negenentwintig": 29,
    	    "dertigste": 30,
    	    "eenendertigste": 31,
    	};
    	exports.TIME_UNIT_DICTIONARY = {
    	    sec: "second",
    	    second: "second",
    	    seconden: "second",
    	    min: "minute",
    	    mins: "minute",
    	    minute: "minute",
    	    minuut: "minute",
    	    minuten: "minute",
    	    minuutje: "minute",
    	    h: "hour",
    	    hr: "hour",
    	    hrs: "hour",
    	    uur: "hour",
    	    u: "hour",
    	    uren: "hour",
    	    dag: "d",
    	    dagen: "d",
    	    week: "week",
    	    weken: "week",
    	    maand: "month",
    	    maanden: "month",
    	    jaar: "year",
    	    jr: "year",
    	    jaren: "year",
    	};
    	exports.NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+[\\.,][0-9]+|halve?|half|paar)`;
    	function parseNumberPattern(match) {
    	    const num = match.toLowerCase();
    	    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
    	        return exports.INTEGER_WORD_DICTIONARY[num];
    	    }
    	    else if (num === "paar") {
    	        return 2;
    	    }
    	    else if (num === "half" || num.match(/halve?/)) {
    	        return 0.5;
    	    }
    	    return parseFloat(num.replace(",", "."));
    	}
    	exports.parseNumberPattern = parseNumberPattern;
    	exports.ORDINAL_NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:ste|de)?)`;
    	function parseOrdinalNumberPattern(match) {
    	    let num = match.toLowerCase();
    	    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
    	        return exports.ORDINAL_WORD_DICTIONARY[num];
    	    }
    	    num = num.replace(/(?:ste|de)$/i, "");
    	    return parseInt(num);
    	}
    	exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
    	exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:voor Christus|na Christus)|[1-2][0-9]{3}|[5-9][0-9])`;
    	function parseYear(match) {
    	    if (/voor Christus/i.test(match)) {
    	        match = match.replace(/voor Christus/i, "");
    	        return -parseInt(match);
    	    }
    	    if (/na Christus/i.test(match)) {
    	        match = match.replace(/na Christus/i, "");
    	        return parseInt(match);
    	    }
    	    const rawYearNumber = parseInt(match);
    	    return years_1.findMostLikelyADYear(rawYearNumber);
    	}
    	exports.parseYear = parseYear;
    	const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
    	const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
    	exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern(`(?:(?:binnen|in)\\s*)?`, SINGLE_TIME_UNIT_PATTERN);
    	function parseTimeUnits(timeunitText) {
    	    const fragments = {};
    	    let remainingText = timeunitText;
    	    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    while (match) {
    	        collectDateTimeFragment(fragments, match);
    	        remainingText = remainingText.substring(match[0].length);
    	        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    }
    	    return fragments;
    	}
    	exports.parseTimeUnits = parseTimeUnits;
    	function collectDateTimeFragment(fragments, match) {
    	    const num = parseNumberPattern(match[1]);
    	    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    	    fragments[unit] = num;
    	}
    	
    } (constants$4));

    var hasRequiredNLTimeUnitWithinFormatParser;

    function requireNLTimeUnitWithinFormatParser () {
    	if (hasRequiredNLTimeUnitWithinFormatParser) return NLTimeUnitWithinFormatParser;
    	hasRequiredNLTimeUnitWithinFormatParser = 1;
    	Object.defineProperty(NLTimeUnitWithinFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$4;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	let NLTimeUnitWithinFormatParser$1 = class NLTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return new RegExp(`(?:binnen|in|binnen de|voor)\\s*` + "(" + constants_1.TIME_UNITS_PATTERN + ")" + `(?=\\W|$)`, "i");
    	    }
    	    innerExtract(context, match) {
    	        const timeUnits = constants_1.parseTimeUnits(match[1]);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	    }
    	};
    	NLTimeUnitWithinFormatParser.default = NLTimeUnitWithinFormatParser$1;
    	
    	return NLTimeUnitWithinFormatParser;
    }

    var NLWeekdayParser = {};

    var hasRequiredNLWeekdayParser;

    function requireNLWeekdayParser () {
    	if (hasRequiredNLWeekdayParser) return NLWeekdayParser;
    	hasRequiredNLWeekdayParser = 1;
    	Object.defineProperty(NLWeekdayParser, "__esModule", { value: true });
    	const constants_1 = constants$4;
    	const pattern_1 = pattern;
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const weekdays_1 = requireWeekdays();
    	const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    	    "(?:op\\s*?)?" +
    	    "(?:(deze|vorige|volgende)\\s*(?:week\\s*)?)?" +
    	    `(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})` +
    	    "(?=\\W|$)", "i");
    	const PREFIX_GROUP = 1;
    	const WEEKDAY_GROUP = 2;
    	const POSTFIX_GROUP = 3;
    	let NLWeekdayParser$1 = class NLWeekdayParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
    	        const weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
    	        const prefix = match[PREFIX_GROUP];
    	        const postfix = match[POSTFIX_GROUP];
    	        let modifierWord = prefix || postfix;
    	        modifierWord = modifierWord || "";
    	        modifierWord = modifierWord.toLowerCase();
    	        let modifier = null;
    	        if (modifierWord == "vorige") {
    	            modifier = "last";
    	        }
    	        else if (modifierWord == "volgende") {
    	            modifier = "next";
    	        }
    	        else if (modifierWord == "deze") {
    	            modifier = "this";
    	        }
    	        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    	    }
    	};
    	NLWeekdayParser.default = NLWeekdayParser$1;
    	
    	return NLWeekdayParser;
    }

    var NLMonthNameMiddleEndianParser$1 = {};

    Object.defineProperty(NLMonthNameMiddleEndianParser$1, "__esModule", { value: true });
    const years_1$4 = years;
    const constants_1$f = constants$4;
    const constants_2$4 = constants$4;
    const constants_3$1 = constants$4;
    const pattern_1$5 = pattern;
    const AbstractParserWithWordBoundary_1$i = AbstractParserWithWordBoundary;
    const PATTERN$c = new RegExp("(?:on\\s*?)?" +
        `(${constants_2$4.ORDINAL_NUMBER_PATTERN})` +
        "(?:\\s*" +
        "(?:tot|\\-|\\–|until|through|till|\\s)\\s*" +
        `(${constants_2$4.ORDINAL_NUMBER_PATTERN})` +
        ")?" +
        "(?:-|/|\\s*(?:of)?\\s*)" +
        "(" +
        pattern_1$5.matchAnyPattern(constants_1$f.MONTH_DICTIONARY) +
        ")" +
        "(?:" +
        "(?:-|/|,?\\s*)" +
        `(${constants_3$1.YEAR_PATTERN}(?![^\\s]\\d))` +
        ")?" +
        "(?=\\W|$)", "i");
    const MONTH_NAME_GROUP$5 = 3;
    const DATE_GROUP$2 = 1;
    const DATE_TO_GROUP$2 = 2;
    const YEAR_GROUP$7 = 4;
    class NLMonthNameMiddleEndianParser extends AbstractParserWithWordBoundary_1$i.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$c;
        }
        innerExtract(context, match) {
            const month = constants_1$f.MONTH_DICTIONARY[match[MONTH_NAME_GROUP$5].toLowerCase()];
            const day = constants_2$4.parseOrdinalNumberPattern(match[DATE_GROUP$2]);
            if (day > 31) {
                match.index = match.index + match[DATE_GROUP$2].length;
                return null;
            }
            const components = context.createParsingComponents({
                day: day,
                month: month,
            });
            if (match[YEAR_GROUP$7]) {
                const year = constants_3$1.parseYear(match[YEAR_GROUP$7]);
                components.assign("year", year);
            }
            else {
                const year = years_1$4.findYearClosestToRef(context.refDate, day, month);
                components.imply("year", year);
            }
            if (!match[DATE_TO_GROUP$2]) {
                return components;
            }
            const endDate = constants_2$4.parseOrdinalNumberPattern(match[DATE_TO_GROUP$2]);
            const result = context.createParsingResult(match.index, match[0]);
            result.start = components;
            result.end = components.clone();
            result.end.assign("day", endDate);
            return result;
        }
    }
    NLMonthNameMiddleEndianParser$1.default = NLMonthNameMiddleEndianParser;

    var NLMonthNameParser$1 = {};

    Object.defineProperty(NLMonthNameParser$1, "__esModule", { value: true });
    const constants_1$e = constants$4;
    const years_1$3 = years;
    const pattern_1$4 = pattern;
    const constants_2$3 = constants$4;
    const AbstractParserWithWordBoundary_1$h = AbstractParserWithWordBoundary;
    const PATTERN$b = new RegExp(`(${pattern_1$4.matchAnyPattern(constants_1$e.MONTH_DICTIONARY)})` +
        `\\s*` +
        `(?:` +
        `[,-]?\\s*(${constants_2$3.YEAR_PATTERN})?` +
        ")?" +
        "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
    const MONTH_NAME_GROUP$4 = 1;
    const YEAR_GROUP$6 = 2;
    class NLMonthNameParser extends AbstractParserWithWordBoundary_1$h.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$b;
        }
        innerExtract(context, match) {
            const components = context.createParsingComponents();
            components.imply("day", 1);
            const monthName = match[MONTH_NAME_GROUP$4];
            const month = constants_1$e.MONTH_DICTIONARY[monthName.toLowerCase()];
            components.assign("month", month);
            if (match[YEAR_GROUP$6]) {
                const year = constants_2$3.parseYear(match[YEAR_GROUP$6]);
                components.assign("year", year);
            }
            else {
                const year = years_1$3.findYearClosestToRef(context.refDate, 1, month);
                components.imply("year", year);
            }
            return components;
        }
    }
    NLMonthNameParser$1.default = NLMonthNameParser;

    var NLSlashMonthFormatParser$1 = {};

    Object.defineProperty(NLSlashMonthFormatParser$1, "__esModule", { value: true });
    const AbstractParserWithWordBoundary_1$g = AbstractParserWithWordBoundary;
    const PATTERN$a = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})" + "", "i");
    const MONTH_GROUP$2 = 1;
    const YEAR_GROUP$5 = 2;
    class NLSlashMonthFormatParser extends AbstractParserWithWordBoundary_1$g.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$a;
        }
        innerExtract(context, match) {
            const year = parseInt(match[YEAR_GROUP$5]);
            const month = parseInt(match[MONTH_GROUP$2]);
            return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
        }
    }
    NLSlashMonthFormatParser$1.default = NLSlashMonthFormatParser;

    var NLTimeExpressionParser = {};

    var hasRequiredNLTimeExpressionParser;

    function requireNLTimeExpressionParser () {
    	if (hasRequiredNLTimeExpressionParser) return NLTimeExpressionParser;
    	hasRequiredNLTimeExpressionParser = 1;
    	Object.defineProperty(NLTimeExpressionParser, "__esModule", { value: true });
    	const AbstractTimeExpressionParser_1 = requireAbstractTimeExpressionParser();
    	let NLTimeExpressionParser$1 = class NLTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    	    primaryPrefix() {
    	        return "(?:(?:om)\\s*)?";
    	    }
    	    followingPhase() {
    	        return "\\s*(?:\\-|\\–|\\~|\\〜|om|\\?)\\s*";
    	    }
    	    primarySuffix() {
    	        return "(?:\\s*(?:uur))?(?!/)(?=\\W|$)";
    	    }
    	    extractPrimaryTimeComponents(context, match) {
    	        if (match[0].match(/^\s*\d{4}\s*$/)) {
    	            return null;
    	        }
    	        return super.extractPrimaryTimeComponents(context, match);
    	    }
    	};
    	NLTimeExpressionParser.default = NLTimeExpressionParser$1;
    	
    	return NLTimeExpressionParser;
    }

    var NLCasualYearMonthDayParser$1 = {};

    Object.defineProperty(NLCasualYearMonthDayParser$1, "__esModule", { value: true });
    const constants_1$d = constants$4;
    const pattern_1$3 = pattern;
    const AbstractParserWithWordBoundary_1$f = AbstractParserWithWordBoundary;
    const PATTERN$9 = new RegExp(`([0-9]{4})[\\.\\/\\s]` +
        `(?:(${pattern_1$3.matchAnyPattern(constants_1$d.MONTH_DICTIONARY)})|([0-9]{1,2}))[\\.\\/\\s]` +
        `([0-9]{1,2})` +
        "(?=\\W|$)", "i");
    const YEAR_NUMBER_GROUP = 1;
    const MONTH_NAME_GROUP$3 = 2;
    const MONTH_NUMBER_GROUP = 3;
    const DATE_NUMBER_GROUP = 4;
    class NLCasualYearMonthDayParser extends AbstractParserWithWordBoundary_1$f.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$9;
        }
        innerExtract(context, match) {
            const month = match[MONTH_NUMBER_GROUP]
                ? parseInt(match[MONTH_NUMBER_GROUP])
                : constants_1$d.MONTH_DICTIONARY[match[MONTH_NAME_GROUP$3].toLowerCase()];
            if (month < 1 || month > 12) {
                return null;
            }
            const year = parseInt(match[YEAR_NUMBER_GROUP]);
            const day = parseInt(match[DATE_NUMBER_GROUP]);
            return {
                day: day,
                month: month,
                year: year,
            };
        }
    }
    NLCasualYearMonthDayParser$1.default = NLCasualYearMonthDayParser;

    var NLCasualDateTimeParser = {};

    var hasRequiredNLCasualDateTimeParser;

    function requireNLCasualDateTimeParser () {
    	if (hasRequiredNLCasualDateTimeParser) return NLCasualDateTimeParser;
    	hasRequiredNLCasualDateTimeParser = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(NLCasualDateTimeParser, "__esModule", { value: true });
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const index_1 = requireDist();
    	const dayjs_1 = requireDayjs();
    	const dayjs_2 = __importDefault(dayjs_minExports);
    	const DATE_GROUP = 1;
    	const TIME_OF_DAY_GROUP = 2;
    	let NLCasualDateTimeParser$1 = class NLCasualDateTimeParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern(context) {
    	        return /(gisteren|morgen|van)(ochtend|middag|namiddag|avond|nacht)(?=\W|$)/i;
    	    }
    	    innerExtract(context, match) {
    	        const dateText = match[DATE_GROUP].toLowerCase();
    	        const timeText = match[TIME_OF_DAY_GROUP].toLowerCase();
    	        const component = context.createParsingComponents();
    	        const targetDate = dayjs_2.default(context.refDate);
    	        switch (dateText) {
    	            case "gisteren":
    	                dayjs_1.assignSimilarDate(component, targetDate.add(-1, "day"));
    	                break;
    	            case "van":
    	                dayjs_1.assignSimilarDate(component, targetDate);
    	                break;
    	            case "morgen":
    	                dayjs_1.assignTheNextDay(component, targetDate);
    	                break;
    	        }
    	        switch (timeText) {
    	            case "ochtend":
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                component.imply("hour", 6);
    	                break;
    	            case "middag":
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                component.imply("hour", 12);
    	                break;
    	            case "namiddag":
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                component.imply("hour", 15);
    	                break;
    	            case "avond":
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                component.imply("hour", 20);
    	                break;
    	        }
    	        return component;
    	    }
    	};
    	NLCasualDateTimeParser.default = NLCasualDateTimeParser$1;
    	
    	return NLCasualDateTimeParser;
    }

    var NLTimeUnitCasualRelativeFormatParser = {};

    var hasRequiredNLTimeUnitCasualRelativeFormatParser;

    function requireNLTimeUnitCasualRelativeFormatParser () {
    	if (hasRequiredNLTimeUnitCasualRelativeFormatParser) return NLTimeUnitCasualRelativeFormatParser;
    	hasRequiredNLTimeUnitCasualRelativeFormatParser = 1;
    	Object.defineProperty(NLTimeUnitCasualRelativeFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$4;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const timeunits_1 = timeunits;
    	const PATTERN = new RegExp(`(deze|vorige|afgelopen|komende|over|\\+|-)\\s*(${constants_1.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    	let NLTimeUnitCasualRelativeFormatParser$1 = class NLTimeUnitCasualRelativeFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const prefix = match[1].toLowerCase();
    	        let timeUnits = constants_1.parseTimeUnits(match[2]);
    	        switch (prefix) {
    	            case "vorige":
    	            case "afgelopen":
    	            case "-":
    	                timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
    	                break;
    	        }
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	    }
    	};
    	NLTimeUnitCasualRelativeFormatParser.default = NLTimeUnitCasualRelativeFormatParser$1;
    	
    	return NLTimeUnitCasualRelativeFormatParser;
    }

    var NLRelativeDateFormatParser = {};

    var hasRequiredNLRelativeDateFormatParser;

    function requireNLRelativeDateFormatParser () {
    	if (hasRequiredNLRelativeDateFormatParser) return NLRelativeDateFormatParser;
    	hasRequiredNLRelativeDateFormatParser = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(NLRelativeDateFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$4;
    	const results_1 = requireResults();
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const pattern_1 = pattern;
    	const PATTERN = new RegExp(`(dit|deze|komende|volgend|volgende|afgelopen|vorige)\\s*(${pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY)})(?=\\s*)` +
    	    "(?=\\W|$)", "i");
    	const MODIFIER_WORD_GROUP = 1;
    	const RELATIVE_WORD_GROUP = 2;
    	let NLRelativeDateFormatParser$1 = class NLRelativeDateFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
    	        const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
    	        const timeunit = constants_1.TIME_UNIT_DICTIONARY[unitWord];
    	        if (modifier == "volgend" || modifier == "volgende" || modifier == "komende") {
    	            const timeUnits = {};
    	            timeUnits[timeunit] = 1;
    	            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	        }
    	        if (modifier == "afgelopen" || modifier == "vorige") {
    	            const timeUnits = {};
    	            timeUnits[timeunit] = -1;
    	            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	        }
    	        const components = context.createParsingComponents();
    	        let date = dayjs_1.default(context.reference.instant);
    	        if (unitWord.match(/week/i)) {
    	            date = date.add(-date.get("d"), "d");
    	            components.imply("day", date.date());
    	            components.imply("month", date.month() + 1);
    	            components.imply("year", date.year());
    	        }
    	        else if (unitWord.match(/maand/i)) {
    	            date = date.add(-date.date() + 1, "d");
    	            components.imply("day", date.date());
    	            components.assign("year", date.year());
    	            components.assign("month", date.month() + 1);
    	        }
    	        else if (unitWord.match(/jaar/i)) {
    	            date = date.add(-date.date() + 1, "d");
    	            date = date.add(-date.month(), "month");
    	            components.imply("day", date.date());
    	            components.imply("month", date.month() + 1);
    	            components.assign("year", date.year());
    	        }
    	        return components;
    	    }
    	};
    	NLRelativeDateFormatParser.default = NLRelativeDateFormatParser$1;
    	
    	return NLRelativeDateFormatParser;
    }

    var NLTimeUnitAgoFormatParser = {};

    var hasRequiredNLTimeUnitAgoFormatParser;

    function requireNLTimeUnitAgoFormatParser () {
    	if (hasRequiredNLTimeUnitAgoFormatParser) return NLTimeUnitAgoFormatParser;
    	hasRequiredNLTimeUnitAgoFormatParser = 1;
    	Object.defineProperty(NLTimeUnitAgoFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$4;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const timeunits_1 = timeunits;
    	const PATTERN = new RegExp("" + "(" + constants_1.TIME_UNITS_PATTERN + ")" + "(?:geleden|voor|eerder)(?=(?:\\W|$))", "i");
    	const STRICT_PATTERN = new RegExp("" + "(" + constants_1.TIME_UNITS_PATTERN + ")" + "geleden(?=(?:\\W|$))", "i");
    	let NLTimeUnitAgoFormatParser$1 = class NLTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    constructor(strictMode) {
    	        super();
    	        this.strictMode = strictMode;
    	    }
    	    innerPattern() {
    	        return this.strictMode ? STRICT_PATTERN : PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const timeUnits = constants_1.parseTimeUnits(match[1]);
    	        const outputTimeUnits = timeunits_1.reverseTimeUnits(timeUnits);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
    	    }
    	};
    	NLTimeUnitAgoFormatParser.default = NLTimeUnitAgoFormatParser$1;
    	
    	return NLTimeUnitAgoFormatParser;
    }

    var NLTimeUnitLaterFormatParser = {};

    var hasRequiredNLTimeUnitLaterFormatParser;

    function requireNLTimeUnitLaterFormatParser () {
    	if (hasRequiredNLTimeUnitLaterFormatParser) return NLTimeUnitLaterFormatParser;
    	hasRequiredNLTimeUnitLaterFormatParser = 1;
    	Object.defineProperty(NLTimeUnitLaterFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$4;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const PATTERN = new RegExp("" + "(" + constants_1.TIME_UNITS_PATTERN + ")" + "(later|na|vanaf nu|voortaan|vooruit|uit)" + "(?=(?:\\W|$))", "i");
    	const STRICT_PATTERN = new RegExp("" + "(" + constants_1.TIME_UNITS_PATTERN + ")" + "(later|vanaf nu)" + "(?=(?:\\W|$))", "i");
    	const GROUP_NUM_TIMEUNITS = 1;
    	let NLTimeUnitLaterFormatParser$1 = class NLTimeUnitLaterFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    constructor(strictMode) {
    	        super();
    	        this.strictMode = strictMode;
    	    }
    	    innerPattern() {
    	        return this.strictMode ? STRICT_PATTERN : PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const fragments = constants_1.parseTimeUnits(match[GROUP_NUM_TIMEUNITS]);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, fragments);
    	    }
    	};
    	NLTimeUnitLaterFormatParser.default = NLTimeUnitLaterFormatParser$1;
    	
    	return NLTimeUnitLaterFormatParser;
    }

    var hasRequiredNl;

    function requireNl () {
    	if (hasRequiredNl) return nl;
    	hasRequiredNl = 1;
    	(function (exports) {
    		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    		    return (mod && mod.__esModule) ? mod : { "default": mod };
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
    		const configurations_1 = requireConfigurations();
    		const chrono_1 = requireChrono();
    		const NLMergeDateRangeRefiner_1 = __importDefault(NLMergeDateRangeRefiner$1);
    		const NLMergeDateTimeRefiner_1 = __importDefault(requireNLMergeDateTimeRefiner());
    		const NLCasualDateParser_1 = __importDefault(requireNLCasualDateParser());
    		const NLCasualTimeParser_1 = __importDefault(requireNLCasualTimeParser());
    		const SlashDateFormatParser_1 = __importDefault(SlashDateFormatParser$1);
    		const NLTimeUnitWithinFormatParser_1 = __importDefault(requireNLTimeUnitWithinFormatParser());
    		const NLWeekdayParser_1 = __importDefault(requireNLWeekdayParser());
    		const NLMonthNameMiddleEndianParser_1 = __importDefault(NLMonthNameMiddleEndianParser$1);
    		const NLMonthNameParser_1 = __importDefault(NLMonthNameParser$1);
    		const NLSlashMonthFormatParser_1 = __importDefault(NLSlashMonthFormatParser$1);
    		const NLTimeExpressionParser_1 = __importDefault(requireNLTimeExpressionParser());
    		const NLCasualYearMonthDayParser_1 = __importDefault(NLCasualYearMonthDayParser$1);
    		const NLCasualDateTimeParser_1 = __importDefault(requireNLCasualDateTimeParser());
    		const NLTimeUnitCasualRelativeFormatParser_1 = __importDefault(requireNLTimeUnitCasualRelativeFormatParser());
    		const NLRelativeDateFormatParser_1 = __importDefault(requireNLRelativeDateFormatParser());
    		const NLTimeUnitAgoFormatParser_1 = __importDefault(requireNLTimeUnitAgoFormatParser());
    		const NLTimeUnitLaterFormatParser_1 = __importDefault(requireNLTimeUnitLaterFormatParser());
    		exports.casual = new chrono_1.Chrono(createCasualConfiguration());
    		exports.strict = new chrono_1.Chrono(createConfiguration(true));
    		function parse(text, ref, option) {
    		    return exports.casual.parse(text, ref, option);
    		}
    		exports.parse = parse;
    		function parseDate(text, ref, option) {
    		    return exports.casual.parseDate(text, ref, option);
    		}
    		exports.parseDate = parseDate;
    		function createCasualConfiguration(littleEndian = true) {
    		    const option = createConfiguration(false, littleEndian);
    		    option.parsers.unshift(new NLCasualDateParser_1.default());
    		    option.parsers.unshift(new NLCasualTimeParser_1.default());
    		    option.parsers.unshift(new NLCasualDateTimeParser_1.default());
    		    option.parsers.unshift(new NLMonthNameParser_1.default());
    		    option.parsers.unshift(new NLRelativeDateFormatParser_1.default());
    		    option.parsers.unshift(new NLTimeUnitCasualRelativeFormatParser_1.default());
    		    return option;
    		}
    		exports.createCasualConfiguration = createCasualConfiguration;
    		function createConfiguration(strictMode = true, littleEndian = true) {
    		    return configurations_1.includeCommonConfiguration({
    		        parsers: [
    		            new SlashDateFormatParser_1.default(littleEndian),
    		            new NLTimeUnitWithinFormatParser_1.default(),
    		            new NLMonthNameMiddleEndianParser_1.default(),
    		            new NLMonthNameParser_1.default(),
    		            new NLWeekdayParser_1.default(),
    		            new NLCasualYearMonthDayParser_1.default(),
    		            new NLSlashMonthFormatParser_1.default(),
    		            new NLTimeExpressionParser_1.default(strictMode),
    		            new NLTimeUnitAgoFormatParser_1.default(strictMode),
    		            new NLTimeUnitLaterFormatParser_1.default(strictMode),
    		        ],
    		        refiners: [new NLMergeDateTimeRefiner_1.default(), new NLMergeDateRangeRefiner_1.default()],
    		    }, strictMode);
    		}
    		exports.createConfiguration = createConfiguration;
    		
    } (nl));
    	return nl;
    }

    var zh = {};

    var hant = {};

    var ZHHantCasualDateParser$1 = {};

    var __importDefault$f = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHantCasualDateParser$1, "__esModule", { value: true });
    const dayjs_1$b = __importDefault$f(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$e = AbstractParserWithWordBoundary;
    const NOW_GROUP$1 = 1;
    const DAY_GROUP_1$3 = 2;
    const TIME_GROUP_1$1 = 3;
    const TIME_GROUP_2$1 = 4;
    const DAY_GROUP_3$3 = 5;
    const TIME_GROUP_3$1 = 6;
    class ZHHantCasualDateParser extends AbstractParserWithWordBoundary_1$e.AbstractParserWithWordBoundaryChecking {
        innerPattern(context) {
            return new RegExp("(而家|立(?:刻|即)|即刻)|" +
                "(今|明|前|大前|後|大後|聽|昨|尋|琴)(早|朝|晚)|" +
                "(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
                "(今|明|前|大前|後|大後|聽|昨|尋|琴)(?:日|天)" +
                "(?:[\\s|,|，]*)" +
                "(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?", "i");
        }
        innerExtract(context, match) {
            const index = match.index;
            const result = context.createParsingResult(index, match[0]);
            const refMoment = dayjs_1$b.default(context.refDate);
            let startMoment = refMoment;
            if (match[NOW_GROUP$1]) {
                result.start.imply("hour", refMoment.hour());
                result.start.imply("minute", refMoment.minute());
                result.start.imply("second", refMoment.second());
                result.start.imply("millisecond", refMoment.millisecond());
            }
            else if (match[DAY_GROUP_1$3]) {
                const day1 = match[DAY_GROUP_1$3];
                const time1 = match[TIME_GROUP_1$1];
                if (day1 == "明" || day1 == "聽") {
                    if (refMoment.hour() > 1) {
                        startMoment = startMoment.add(1, "day");
                    }
                }
                else if (day1 == "昨" || day1 == "尋" || day1 == "琴") {
                    startMoment = startMoment.add(-1, "day");
                }
                else if (day1 == "前") {
                    startMoment = startMoment.add(-2, "day");
                }
                else if (day1 == "大前") {
                    startMoment = startMoment.add(-3, "day");
                }
                else if (day1 == "後") {
                    startMoment = startMoment.add(2, "day");
                }
                else if (day1 == "大後") {
                    startMoment = startMoment.add(3, "day");
                }
                if (time1 == "早" || time1 == "朝") {
                    result.start.imply("hour", 6);
                }
                else if (time1 == "晚") {
                    result.start.imply("hour", 22);
                    result.start.imply("meridiem", 1);
                }
            }
            else if (match[TIME_GROUP_2$1]) {
                const timeString2 = match[TIME_GROUP_2$1];
                const time2 = timeString2[0];
                if (time2 == "早" || time2 == "朝" || time2 == "上") {
                    result.start.imply("hour", 6);
                }
                else if (time2 == "下" || time2 == "晏") {
                    result.start.imply("hour", 15);
                    result.start.imply("meridiem", 1);
                }
                else if (time2 == "中") {
                    result.start.imply("hour", 12);
                    result.start.imply("meridiem", 1);
                }
                else if (time2 == "夜" || time2 == "晚") {
                    result.start.imply("hour", 22);
                    result.start.imply("meridiem", 1);
                }
                else if (time2 == "凌") {
                    result.start.imply("hour", 0);
                }
            }
            else if (match[DAY_GROUP_3$3]) {
                const day3 = match[DAY_GROUP_3$3];
                if (day3 == "明" || day3 == "聽") {
                    if (refMoment.hour() > 1) {
                        startMoment = startMoment.add(1, "day");
                    }
                }
                else if (day3 == "昨" || day3 == "尋" || day3 == "琴") {
                    startMoment = startMoment.add(-1, "day");
                }
                else if (day3 == "前") {
                    startMoment = startMoment.add(-2, "day");
                }
                else if (day3 == "大前") {
                    startMoment = startMoment.add(-3, "day");
                }
                else if (day3 == "後") {
                    startMoment = startMoment.add(2, "day");
                }
                else if (day3 == "大後") {
                    startMoment = startMoment.add(3, "day");
                }
                const timeString3 = match[TIME_GROUP_3$1];
                if (timeString3) {
                    const time3 = timeString3[0];
                    if (time3 == "早" || time3 == "朝" || time3 == "上") {
                        result.start.imply("hour", 6);
                    }
                    else if (time3 == "下" || time3 == "晏") {
                        result.start.imply("hour", 15);
                        result.start.imply("meridiem", 1);
                    }
                    else if (time3 == "中") {
                        result.start.imply("hour", 12);
                        result.start.imply("meridiem", 1);
                    }
                    else if (time3 == "夜" || time3 == "晚") {
                        result.start.imply("hour", 22);
                        result.start.imply("meridiem", 1);
                    }
                    else if (time3 == "凌") {
                        result.start.imply("hour", 0);
                    }
                }
            }
            result.start.assign("day", startMoment.date());
            result.start.assign("month", startMoment.month() + 1);
            result.start.assign("year", startMoment.year());
            return result;
        }
    }
    ZHHantCasualDateParser$1.default = ZHHantCasualDateParser;

    var ZHHantDateParser$1 = {};

    var constants$3 = {};

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.zhStringToYear = exports.zhStringToNumber = exports.WEEKDAY_OFFSET = exports.NUMBER = void 0;
    	exports.NUMBER = {
    	    "零": 0,
    	    "一": 1,
    	    "二": 2,
    	    "兩": 2,
    	    "三": 3,
    	    "四": 4,
    	    "五": 5,
    	    "六": 6,
    	    "七": 7,
    	    "八": 8,
    	    "九": 9,
    	    "十": 10,
    	    "廿": 20,
    	    "卅": 30,
    	};
    	exports.WEEKDAY_OFFSET = {
    	    "天": 0,
    	    "日": 0,
    	    "一": 1,
    	    "二": 2,
    	    "三": 3,
    	    "四": 4,
    	    "五": 5,
    	    "六": 6,
    	};
    	function zhStringToNumber(text) {
    	    let number = 0;
    	    for (let i = 0; i < text.length; i++) {
    	        const char = text[i];
    	        if (char === "十") {
    	            number = number === 0 ? exports.NUMBER[char] : number * exports.NUMBER[char];
    	        }
    	        else {
    	            number += exports.NUMBER[char];
    	        }
    	    }
    	    return number;
    	}
    	exports.zhStringToNumber = zhStringToNumber;
    	function zhStringToYear(text) {
    	    let string = "";
    	    for (let i = 0; i < text.length; i++) {
    	        const char = text[i];
    	        string = string + exports.NUMBER[char];
    	    }
    	    return parseInt(string);
    	}
    	exports.zhStringToYear = zhStringToYear;
    	
    } (constants$3));

    var __importDefault$e = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHantDateParser$1, "__esModule", { value: true });
    const dayjs_1$a = __importDefault$e(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$d = AbstractParserWithWordBoundary;
    const constants_1$c = constants$3;
    const YEAR_GROUP$4 = 1;
    const MONTH_GROUP$1 = 2;
    const DAY_GROUP$1 = 3;
    class ZHHantDateParser extends AbstractParserWithWordBoundary_1$d.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return new RegExp("(" +
                "\\d{2,4}|" +
                "[" + Object.keys(constants_1$c.NUMBER).join("") + "]{4}|" +
                "[" + Object.keys(constants_1$c.NUMBER).join("") + "]{2}" +
                ")?" +
                "(?:\\s*)" +
                "(?:年)?" +
                "(?:[\\s|,|，]*)" +
                "(" +
                "\\d{1,2}|" +
                "[" + Object.keys(constants_1$c.NUMBER).join("") + "]{1,2}" +
                ")" +
                "(?:\\s*)" +
                "(?:月)" +
                "(?:\\s*)" +
                "(" +
                "\\d{1,2}|" +
                "[" + Object.keys(constants_1$c.NUMBER).join("") + "]{1,2}" +
                ")?" +
                "(?:\\s*)" +
                "(?:日|號)?");
        }
        innerExtract(context, match) {
            const startMoment = dayjs_1$a.default(context.refDate);
            const result = context.createParsingResult(match.index, match[0]);
            let month = parseInt(match[MONTH_GROUP$1]);
            if (isNaN(month))
                month = constants_1$c.zhStringToNumber(match[MONTH_GROUP$1]);
            result.start.assign("month", month);
            if (match[DAY_GROUP$1]) {
                let day = parseInt(match[DAY_GROUP$1]);
                if (isNaN(day))
                    day = constants_1$c.zhStringToNumber(match[DAY_GROUP$1]);
                result.start.assign("day", day);
            }
            else {
                result.start.imply("day", startMoment.date());
            }
            if (match[YEAR_GROUP$4]) {
                let year = parseInt(match[YEAR_GROUP$4]);
                if (isNaN(year))
                    year = constants_1$c.zhStringToYear(match[YEAR_GROUP$4]);
                result.start.assign("year", year);
            }
            else {
                result.start.imply("year", startMoment.year());
            }
            return result;
        }
    }
    ZHHantDateParser$1.default = ZHHantDateParser;

    var ZHHantDeadlineFormatParser$1 = {};

    var __importDefault$d = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHantDeadlineFormatParser$1, "__esModule", { value: true });
    const dayjs_1$9 = __importDefault$d(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$c = AbstractParserWithWordBoundary;
    const constants_1$b = constants$3;
    const PATTERN$8 = new RegExp("(\\d+|[" +
        Object.keys(constants_1$b.NUMBER).join("") +
        "]+|半|幾)(?:\\s*)" +
        "(?:個)?" +
        "(秒(?:鐘)?|分鐘|小時|鐘|日|天|星期|禮拜|月|年)" +
        "(?:(?:之|過)?後|(?:之)?內)", "i");
    const NUMBER_GROUP$1 = 1;
    const UNIT_GROUP$1 = 2;
    class ZHHantDeadlineFormatParser extends AbstractParserWithWordBoundary_1$c.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$8;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            let number = parseInt(match[NUMBER_GROUP$1]);
            if (isNaN(number)) {
                number = constants_1$b.zhStringToNumber(match[NUMBER_GROUP$1]);
            }
            if (isNaN(number)) {
                const string = match[NUMBER_GROUP$1];
                if (string === "幾") {
                    number = 3;
                }
                else if (string === "半") {
                    number = 0.5;
                }
                else {
                    return null;
                }
            }
            let date = dayjs_1$9.default(context.refDate);
            const unit = match[UNIT_GROUP$1];
            const unitAbbr = unit[0];
            if (unitAbbr.match(/[日天星禮月年]/)) {
                if (unitAbbr == "日" || unitAbbr == "天") {
                    date = date.add(number, "d");
                }
                else if (unitAbbr == "星" || unitAbbr == "禮") {
                    date = date.add(number * 7, "d");
                }
                else if (unitAbbr == "月") {
                    date = date.add(number, "month");
                }
                else if (unitAbbr == "年") {
                    date = date.add(number, "year");
                }
                result.start.assign("year", date.year());
                result.start.assign("month", date.month() + 1);
                result.start.assign("day", date.date());
                return result;
            }
            if (unitAbbr == "秒") {
                date = date.add(number, "second");
            }
            else if (unitAbbr == "分") {
                date = date.add(number, "minute");
            }
            else if (unitAbbr == "小" || unitAbbr == "鐘") {
                date = date.add(number, "hour");
            }
            result.start.imply("year", date.year());
            result.start.imply("month", date.month() + 1);
            result.start.imply("day", date.date());
            result.start.assign("hour", date.hour());
            result.start.assign("minute", date.minute());
            result.start.assign("second", date.second());
            return result;
        }
    }
    ZHHantDeadlineFormatParser$1.default = ZHHantDeadlineFormatParser;

    var ZHHantRelationWeekdayParser$1 = {};

    var __importDefault$c = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHantRelationWeekdayParser$1, "__esModule", { value: true });
    const dayjs_1$8 = __importDefault$c(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$b = AbstractParserWithWordBoundary;
    const constants_1$a = constants$3;
    const PATTERN$7 = new RegExp("(?<prefix>上|今|下|這|呢)(?:個)?(?:星期|禮拜|週)(?<weekday>" + Object.keys(constants_1$a.WEEKDAY_OFFSET).join("|") + ")");
    class ZHHantRelationWeekdayParser extends AbstractParserWithWordBoundary_1$b.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$7;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            const dayOfWeek = match.groups.weekday;
            const offset = constants_1$a.WEEKDAY_OFFSET[dayOfWeek];
            if (offset === undefined)
                return null;
            let modifier = null;
            const prefix = match.groups.prefix;
            if (prefix == "上") {
                modifier = "last";
            }
            else if (prefix == "下") {
                modifier = "next";
            }
            else if (prefix == "今" || prefix == "這" || prefix == "呢") {
                modifier = "this";
            }
            let startMoment = dayjs_1$8.default(context.refDate);
            let startMomentFixed = false;
            const refOffset = startMoment.day();
            if (modifier == "last" || modifier == "past") {
                startMoment = startMoment.day(offset - 7);
                startMomentFixed = true;
            }
            else if (modifier == "next") {
                startMoment = startMoment.day(offset + 7);
                startMomentFixed = true;
            }
            else if (modifier == "this") {
                startMoment = startMoment.day(offset);
            }
            else {
                if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                    startMoment = startMoment.day(offset - 7);
                }
                else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                    startMoment = startMoment.day(offset + 7);
                }
                else {
                    startMoment = startMoment.day(offset);
                }
            }
            result.start.assign("weekday", offset);
            if (startMomentFixed) {
                result.start.assign("day", startMoment.date());
                result.start.assign("month", startMoment.month() + 1);
                result.start.assign("year", startMoment.year());
            }
            else {
                result.start.imply("day", startMoment.date());
                result.start.imply("month", startMoment.month() + 1);
                result.start.imply("year", startMoment.year());
            }
            return result;
        }
    }
    ZHHantRelationWeekdayParser$1.default = ZHHantRelationWeekdayParser;

    var ZHHantTimeExpressionParser$1 = {};

    var __importDefault$b = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHantTimeExpressionParser$1, "__esModule", { value: true });
    const dayjs_1$7 = __importDefault$b(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$a = AbstractParserWithWordBoundary;
    const constants_1$9 = constants$3;
    const FIRST_REG_PATTERN$1 = new RegExp("(?:由|從|自)?" +
        "(?:" +
        "(今|明|前|大前|後|大後|聽|昨|尋|琴)(早|朝|晚)|" +
        "(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
        "(今|明|前|大前|後|大後|聽|昨|尋|琴)(?:日|天)" +
        "(?:[\\s,，]*)" +
        "(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
        ")?" +
        "(?:[\\s,，]*)" +
        "(?:(\\d+|[" +
        Object.keys(constants_1$9.NUMBER).join("") +
        "]+)(?:\\s*)(?:點|時|:|：)" +
        "(?:\\s*)" +
        "(\\d+|半|正|整|[" +
        Object.keys(constants_1$9.NUMBER).join("") +
        "]+)?(?:\\s*)(?:分|:|：)?" +
        "(?:\\s*)" +
        "(\\d+|[" +
        Object.keys(constants_1$9.NUMBER).join("") +
        "]+)?(?:\\s*)(?:秒)?)" +
        "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
    const SECOND_REG_PATTERN$1 = new RegExp("(?:^\\s*(?:到|至|\\-|\\–|\\~|\\〜)\\s*)" +
        "(?:" +
        "(今|明|前|大前|後|大後|聽|昨|尋|琴)(早|朝|晚)|" +
        "(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
        "(今|明|前|大前|後|大後|聽|昨|尋|琴)(?:日|天)" +
        "(?:[\\s,，]*)" +
        "(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
        ")?" +
        "(?:[\\s,，]*)" +
        "(?:(\\d+|[" +
        Object.keys(constants_1$9.NUMBER).join("") +
        "]+)(?:\\s*)(?:點|時|:|：)" +
        "(?:\\s*)" +
        "(\\d+|半|正|整|[" +
        Object.keys(constants_1$9.NUMBER).join("") +
        "]+)?(?:\\s*)(?:分|:|：)?" +
        "(?:\\s*)" +
        "(\\d+|[" +
        Object.keys(constants_1$9.NUMBER).join("") +
        "]+)?(?:\\s*)(?:秒)?)" +
        "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
    const DAY_GROUP_1$2 = 1;
    const ZH_AM_PM_HOUR_GROUP_1$1 = 2;
    const ZH_AM_PM_HOUR_GROUP_2$1 = 3;
    const DAY_GROUP_3$2 = 4;
    const ZH_AM_PM_HOUR_GROUP_3$1 = 5;
    const HOUR_GROUP$1 = 6;
    const MINUTE_GROUP$1 = 7;
    const SECOND_GROUP$1 = 8;
    const AM_PM_HOUR_GROUP$1 = 9;
    class ZHHantTimeExpressionParser extends AbstractParserWithWordBoundary_1$a.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return FIRST_REG_PATTERN$1;
        }
        innerExtract(context, match) {
            if (match.index > 0 && context.text[match.index - 1].match(/\w/)) {
                return null;
            }
            const refMoment = dayjs_1$7.default(context.refDate);
            const result = context.createParsingResult(match.index, match[0]);
            let startMoment = refMoment.clone();
            if (match[DAY_GROUP_1$2]) {
                var day1 = match[DAY_GROUP_1$2];
                if (day1 == "明" || day1 == "聽") {
                    if (refMoment.hour() > 1) {
                        startMoment = startMoment.add(1, "day");
                    }
                }
                else if (day1 == "昨" || day1 == "尋" || day1 == "琴") {
                    startMoment = startMoment.add(-1, "day");
                }
                else if (day1 == "前") {
                    startMoment = startMoment.add(-2, "day");
                }
                else if (day1 == "大前") {
                    startMoment = startMoment.add(-3, "day");
                }
                else if (day1 == "後") {
                    startMoment = startMoment.add(2, "day");
                }
                else if (day1 == "大後") {
                    startMoment = startMoment.add(3, "day");
                }
                result.start.assign("day", startMoment.date());
                result.start.assign("month", startMoment.month() + 1);
                result.start.assign("year", startMoment.year());
            }
            else if (match[DAY_GROUP_3$2]) {
                var day3 = match[DAY_GROUP_3$2];
                if (day3 == "明" || day3 == "聽") {
                    startMoment = startMoment.add(1, "day");
                }
                else if (day3 == "昨" || day3 == "尋" || day3 == "琴") {
                    startMoment = startMoment.add(-1, "day");
                }
                else if (day3 == "前") {
                    startMoment = startMoment.add(-2, "day");
                }
                else if (day3 == "大前") {
                    startMoment = startMoment.add(-3, "day");
                }
                else if (day3 == "後") {
                    startMoment = startMoment.add(2, "day");
                }
                else if (day3 == "大後") {
                    startMoment = startMoment.add(3, "day");
                }
                result.start.assign("day", startMoment.date());
                result.start.assign("month", startMoment.month() + 1);
                result.start.assign("year", startMoment.year());
            }
            else {
                result.start.imply("day", startMoment.date());
                result.start.imply("month", startMoment.month() + 1);
                result.start.imply("year", startMoment.year());
            }
            let hour = 0;
            let minute = 0;
            let meridiem = -1;
            if (match[SECOND_GROUP$1]) {
                var second = parseInt(match[SECOND_GROUP$1]);
                if (isNaN(second)) {
                    second = constants_1$9.zhStringToNumber(match[SECOND_GROUP$1]);
                }
                if (second >= 60)
                    return null;
                result.start.assign("second", second);
            }
            hour = parseInt(match[HOUR_GROUP$1]);
            if (isNaN(hour)) {
                hour = constants_1$9.zhStringToNumber(match[HOUR_GROUP$1]);
            }
            if (match[MINUTE_GROUP$1]) {
                if (match[MINUTE_GROUP$1] == "半") {
                    minute = 30;
                }
                else if (match[MINUTE_GROUP$1] == "正" || match[MINUTE_GROUP$1] == "整") {
                    minute = 0;
                }
                else {
                    minute = parseInt(match[MINUTE_GROUP$1]);
                    if (isNaN(minute)) {
                        minute = constants_1$9.zhStringToNumber(match[MINUTE_GROUP$1]);
                    }
                }
            }
            else if (hour > 100) {
                minute = hour % 100;
                hour = Math.floor(hour / 100);
            }
            if (minute >= 60) {
                return null;
            }
            if (hour > 24) {
                return null;
            }
            if (hour >= 12) {
                meridiem = 1;
            }
            if (match[AM_PM_HOUR_GROUP$1]) {
                if (hour > 12)
                    return null;
                var ampm = match[AM_PM_HOUR_GROUP$1][0].toLowerCase();
                if (ampm == "a") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                if (ampm == "p") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_1$1]) {
                var zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1$1];
                var zhAMPM1 = zhAMPMString1[0];
                if (zhAMPM1 == "朝" || zhAMPM1 == "早") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM1 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_2$1]) {
                var zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2$1];
                var zhAMPM2 = zhAMPMString2[0];
                if (zhAMPM2 == "上" || zhAMPM2 == "朝" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM2 == "下" || zhAMPM2 == "晏" || zhAMPM2 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_3$1]) {
                var zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3$1];
                var zhAMPM3 = zhAMPMString3[0];
                if (zhAMPM3 == "上" || zhAMPM3 == "朝" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM3 == "下" || zhAMPM3 == "晏" || zhAMPM3 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            result.start.assign("hour", hour);
            result.start.assign("minute", minute);
            if (meridiem >= 0) {
                result.start.assign("meridiem", meridiem);
            }
            else {
                if (hour < 12) {
                    result.start.imply("meridiem", 0);
                }
                else {
                    result.start.imply("meridiem", 1);
                }
            }
            match = SECOND_REG_PATTERN$1.exec(context.text.substring(result.index + result.text.length));
            if (!match) {
                if (result.text.match(/^\d+$/)) {
                    return null;
                }
                return result;
            }
            let endMoment = startMoment.clone();
            result.end = context.createParsingComponents();
            if (match[DAY_GROUP_1$2]) {
                var day1 = match[DAY_GROUP_1$2];
                if (day1 == "明" || day1 == "聽") {
                    if (refMoment.hour() > 1) {
                        endMoment = endMoment.add(1, "day");
                    }
                }
                else if (day1 == "昨" || day1 == "尋" || day1 == "琴") {
                    endMoment = endMoment.add(-1, "day");
                }
                else if (day1 == "前") {
                    endMoment = endMoment.add(-2, "day");
                }
                else if (day1 == "大前") {
                    endMoment = endMoment.add(-3, "day");
                }
                else if (day1 == "後") {
                    endMoment = endMoment.add(2, "day");
                }
                else if (day1 == "大後") {
                    endMoment = endMoment.add(3, "day");
                }
                result.end.assign("day", endMoment.date());
                result.end.assign("month", endMoment.month() + 1);
                result.end.assign("year", endMoment.year());
            }
            else if (match[DAY_GROUP_3$2]) {
                var day3 = match[DAY_GROUP_3$2];
                if (day3 == "明" || day3 == "聽") {
                    endMoment = endMoment.add(1, "day");
                }
                else if (day3 == "昨" || day3 == "尋" || day3 == "琴") {
                    endMoment = endMoment.add(-1, "day");
                }
                else if (day3 == "前") {
                    endMoment = endMoment.add(-2, "day");
                }
                else if (day3 == "大前") {
                    endMoment = endMoment.add(-3, "day");
                }
                else if (day3 == "後") {
                    endMoment = endMoment.add(2, "day");
                }
                else if (day3 == "大後") {
                    endMoment = endMoment.add(3, "day");
                }
                result.end.assign("day", endMoment.date());
                result.end.assign("month", endMoment.month() + 1);
                result.end.assign("year", endMoment.year());
            }
            else {
                result.end.imply("day", endMoment.date());
                result.end.imply("month", endMoment.month() + 1);
                result.end.imply("year", endMoment.year());
            }
            hour = 0;
            minute = 0;
            meridiem = -1;
            if (match[SECOND_GROUP$1]) {
                var second = parseInt(match[SECOND_GROUP$1]);
                if (isNaN(second)) {
                    second = constants_1$9.zhStringToNumber(match[SECOND_GROUP$1]);
                }
                if (second >= 60)
                    return null;
                result.end.assign("second", second);
            }
            hour = parseInt(match[HOUR_GROUP$1]);
            if (isNaN(hour)) {
                hour = constants_1$9.zhStringToNumber(match[HOUR_GROUP$1]);
            }
            if (match[MINUTE_GROUP$1]) {
                if (match[MINUTE_GROUP$1] == "半") {
                    minute = 30;
                }
                else if (match[MINUTE_GROUP$1] == "正" || match[MINUTE_GROUP$1] == "整") {
                    minute = 0;
                }
                else {
                    minute = parseInt(match[MINUTE_GROUP$1]);
                    if (isNaN(minute)) {
                        minute = constants_1$9.zhStringToNumber(match[MINUTE_GROUP$1]);
                    }
                }
            }
            else if (hour > 100) {
                minute = hour % 100;
                hour = Math.floor(hour / 100);
            }
            if (minute >= 60) {
                return null;
            }
            if (hour > 24) {
                return null;
            }
            if (hour >= 12) {
                meridiem = 1;
            }
            if (match[AM_PM_HOUR_GROUP$1]) {
                if (hour > 12)
                    return null;
                var ampm = match[AM_PM_HOUR_GROUP$1][0].toLowerCase();
                if (ampm == "a") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                if (ampm == "p") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
                if (!result.start.isCertain("meridiem")) {
                    if (meridiem == 0) {
                        result.start.imply("meridiem", 0);
                        if (result.start.get("hour") == 12) {
                            result.start.assign("hour", 0);
                        }
                    }
                    else {
                        result.start.imply("meridiem", 1);
                        if (result.start.get("hour") != 12) {
                            result.start.assign("hour", result.start.get("hour") + 12);
                        }
                    }
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_1$1]) {
                var zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1$1];
                var zhAMPM1 = zhAMPMString1[0];
                if (zhAMPM1 == "朝" || zhAMPM1 == "早") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM1 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_2$1]) {
                var zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2$1];
                var zhAMPM2 = zhAMPMString2[0];
                if (zhAMPM2 == "上" || zhAMPM2 == "朝" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM2 == "下" || zhAMPM2 == "晏" || zhAMPM2 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_3$1]) {
                var zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3$1];
                var zhAMPM3 = zhAMPMString3[0];
                if (zhAMPM3 == "上" || zhAMPM3 == "朝" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM3 == "下" || zhAMPM3 == "晏" || zhAMPM3 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            result.text = result.text + match[0];
            result.end.assign("hour", hour);
            result.end.assign("minute", minute);
            if (meridiem >= 0) {
                result.end.assign("meridiem", meridiem);
            }
            else {
                const startAtPM = result.start.isCertain("meridiem") && result.start.get("meridiem") == 1;
                if (startAtPM && result.start.get("hour") > hour) {
                    result.end.imply("meridiem", 0);
                }
                else if (hour > 12) {
                    result.end.imply("meridiem", 1);
                }
            }
            if (result.end.date().getTime() < result.start.date().getTime()) {
                result.end.imply("day", result.end.get("day") + 1);
            }
            return result;
        }
    }
    ZHHantTimeExpressionParser$1.default = ZHHantTimeExpressionParser;

    var ZHHantWeekdayParser$1 = {};

    var __importDefault$a = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHantWeekdayParser$1, "__esModule", { value: true });
    const dayjs_1$6 = __importDefault$a(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$9 = AbstractParserWithWordBoundary;
    const constants_1$8 = constants$3;
    const PATTERN$6 = new RegExp("(?:星期|禮拜|週)(?<weekday>" + Object.keys(constants_1$8.WEEKDAY_OFFSET).join("|") + ")");
    class ZHHantWeekdayParser extends AbstractParserWithWordBoundary_1$9.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$6;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            const dayOfWeek = match.groups.weekday;
            const offset = constants_1$8.WEEKDAY_OFFSET[dayOfWeek];
            if (offset === undefined)
                return null;
            let startMoment = dayjs_1$6.default(context.refDate);
            const refOffset = startMoment.day();
            if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                startMoment = startMoment.day(offset - 7);
            }
            else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                startMoment = startMoment.day(offset + 7);
            }
            else {
                startMoment = startMoment.day(offset);
            }
            result.start.assign("weekday", offset);
            {
                result.start.imply("day", startMoment.date());
                result.start.imply("month", startMoment.month() + 1);
                result.start.imply("year", startMoment.year());
            }
            return result;
        }
    }
    ZHHantWeekdayParser$1.default = ZHHantWeekdayParser;

    var ZHHantMergeDateRangeRefiner$1 = {};

    var __importDefault$9 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHantMergeDateRangeRefiner$1, "__esModule", { value: true });
    const AbstractMergeDateRangeRefiner_1$3 = __importDefault$9(AbstractMergeDateRangeRefiner$1);
    class ZHHantMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$3.default {
        patternBetween() {
            return /^\s*(至|到|\-|\~|～|－|ー)\s*$/i;
        }
    }
    ZHHantMergeDateRangeRefiner$1.default = ZHHantMergeDateRangeRefiner;

    var ZHHantMergeDateTimeRefiner = {};

    var hasRequiredZHHantMergeDateTimeRefiner;

    function requireZHHantMergeDateTimeRefiner () {
    	if (hasRequiredZHHantMergeDateTimeRefiner) return ZHHantMergeDateTimeRefiner;
    	hasRequiredZHHantMergeDateTimeRefiner = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(ZHHantMergeDateTimeRefiner, "__esModule", { value: true });
    	const AbstractMergeDateTimeRefiner_1 = __importDefault(requireAbstractMergeDateTimeRefiner());
    	let ZHHantMergeDateTimeRefiner$1 = class ZHHantMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    	    patternBetween() {
    	        return /^\s*$/i;
    	    }
    	};
    	ZHHantMergeDateTimeRefiner.default = ZHHantMergeDateTimeRefiner$1;
    	
    	return ZHHantMergeDateTimeRefiner;
    }

    var hasRequiredHant;

    function requireHant () {
    	if (hasRequiredHant) return hant;
    	hasRequiredHant = 1;
    	(function (exports) {
    		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    		    return (mod && mod.__esModule) ? mod : { "default": mod };
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.hant = void 0;
    		const chrono_1 = requireChrono();
    		const ExtractTimezoneOffsetRefiner_1 = __importDefault(ExtractTimezoneOffsetRefiner$1);
    		const configurations_1 = requireConfigurations();
    		const ZHHantCasualDateParser_1 = __importDefault(ZHHantCasualDateParser$1);
    		const ZHHantDateParser_1 = __importDefault(ZHHantDateParser$1);
    		const ZHHantDeadlineFormatParser_1 = __importDefault(ZHHantDeadlineFormatParser$1);
    		const ZHHantRelationWeekdayParser_1 = __importDefault(ZHHantRelationWeekdayParser$1);
    		const ZHHantTimeExpressionParser_1 = __importDefault(ZHHantTimeExpressionParser$1);
    		const ZHHantWeekdayParser_1 = __importDefault(ZHHantWeekdayParser$1);
    		const ZHHantMergeDateRangeRefiner_1 = __importDefault(ZHHantMergeDateRangeRefiner$1);
    		const ZHHantMergeDateTimeRefiner_1 = __importDefault(requireZHHantMergeDateTimeRefiner());
    		exports.hant = new chrono_1.Chrono(createCasualConfiguration());
    		exports.casual = new chrono_1.Chrono(createCasualConfiguration());
    		exports.strict = new chrono_1.Chrono(createConfiguration());
    		function parse(text, ref, option) {
    		    return exports.casual.parse(text, ref, option);
    		}
    		exports.parse = parse;
    		function parseDate(text, ref, option) {
    		    return exports.casual.parseDate(text, ref, option);
    		}
    		exports.parseDate = parseDate;
    		function createCasualConfiguration() {
    		    const option = createConfiguration();
    		    option.parsers.unshift(new ZHHantCasualDateParser_1.default());
    		    return option;
    		}
    		exports.createCasualConfiguration = createCasualConfiguration;
    		function createConfiguration() {
    		    const configuration = configurations_1.includeCommonConfiguration({
    		        parsers: [
    		            new ZHHantDateParser_1.default(),
    		            new ZHHantRelationWeekdayParser_1.default(),
    		            new ZHHantWeekdayParser_1.default(),
    		            new ZHHantTimeExpressionParser_1.default(),
    		            new ZHHantDeadlineFormatParser_1.default(),
    		        ],
    		        refiners: [new ZHHantMergeDateRangeRefiner_1.default(), new ZHHantMergeDateTimeRefiner_1.default()],
    		    });
    		    configuration.refiners = configuration.refiners.filter((refiner) => !(refiner instanceof ExtractTimezoneOffsetRefiner_1.default));
    		    return configuration;
    		}
    		exports.createConfiguration = createConfiguration;
    		
    } (hant));
    	return hant;
    }

    var hans = {};

    var ZHHansCasualDateParser$1 = {};

    var __importDefault$8 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHansCasualDateParser$1, "__esModule", { value: true });
    const dayjs_1$5 = __importDefault$8(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$8 = AbstractParserWithWordBoundary;
    const NOW_GROUP = 1;
    const DAY_GROUP_1$1 = 2;
    const TIME_GROUP_1 = 3;
    const TIME_GROUP_2 = 4;
    const DAY_GROUP_3$1 = 5;
    const TIME_GROUP_3 = 6;
    class ZHHansCasualDateParser extends AbstractParserWithWordBoundary_1$8.AbstractParserWithWordBoundaryChecking {
        innerPattern(context) {
            return new RegExp("(现在|立(?:刻|即)|即刻)|" +
                "(今|明|前|大前|后|大后|昨)(早|晚)|" +
                "(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
                "(今|明|前|大前|后|大后|昨)(?:日|天)" +
                "(?:[\\s|,|，]*)" +
                "(?:(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?", "i");
        }
        innerExtract(context, match) {
            const index = match.index;
            const result = context.createParsingResult(index, match[0]);
            const refMoment = dayjs_1$5.default(context.refDate);
            let startMoment = refMoment;
            if (match[NOW_GROUP]) {
                result.start.imply("hour", refMoment.hour());
                result.start.imply("minute", refMoment.minute());
                result.start.imply("second", refMoment.second());
                result.start.imply("millisecond", refMoment.millisecond());
            }
            else if (match[DAY_GROUP_1$1]) {
                const day1 = match[DAY_GROUP_1$1];
                const time1 = match[TIME_GROUP_1];
                if (day1 == "明") {
                    if (refMoment.hour() > 1) {
                        startMoment = startMoment.add(1, "day");
                    }
                }
                else if (day1 == "昨") {
                    startMoment = startMoment.add(-1, "day");
                }
                else if (day1 == "前") {
                    startMoment = startMoment.add(-2, "day");
                }
                else if (day1 == "大前") {
                    startMoment = startMoment.add(-3, "day");
                }
                else if (day1 == "后") {
                    startMoment = startMoment.add(2, "day");
                }
                else if (day1 == "大后") {
                    startMoment = startMoment.add(3, "day");
                }
                if (time1 == "早") {
                    result.start.imply("hour", 6);
                }
                else if (time1 == "晚") {
                    result.start.imply("hour", 22);
                    result.start.imply("meridiem", 1);
                }
            }
            else if (match[TIME_GROUP_2]) {
                const timeString2 = match[TIME_GROUP_2];
                const time2 = timeString2[0];
                if (time2 == "早" || time2 == "上") {
                    result.start.imply("hour", 6);
                }
                else if (time2 == "下") {
                    result.start.imply("hour", 15);
                    result.start.imply("meridiem", 1);
                }
                else if (time2 == "中") {
                    result.start.imply("hour", 12);
                    result.start.imply("meridiem", 1);
                }
                else if (time2 == "夜" || time2 == "晚") {
                    result.start.imply("hour", 22);
                    result.start.imply("meridiem", 1);
                }
                else if (time2 == "凌") {
                    result.start.imply("hour", 0);
                }
            }
            else if (match[DAY_GROUP_3$1]) {
                const day3 = match[DAY_GROUP_3$1];
                if (day3 == "明") {
                    if (refMoment.hour() > 1) {
                        startMoment = startMoment.add(1, "day");
                    }
                }
                else if (day3 == "昨") {
                    startMoment = startMoment.add(-1, "day");
                }
                else if (day3 == "前") {
                    startMoment = startMoment.add(-2, "day");
                }
                else if (day3 == "大前") {
                    startMoment = startMoment.add(-3, "day");
                }
                else if (day3 == "后") {
                    startMoment = startMoment.add(2, "day");
                }
                else if (day3 == "大后") {
                    startMoment = startMoment.add(3, "day");
                }
                const timeString3 = match[TIME_GROUP_3];
                if (timeString3) {
                    const time3 = timeString3[0];
                    if (time3 == "早" || time3 == "上") {
                        result.start.imply("hour", 6);
                    }
                    else if (time3 == "下") {
                        result.start.imply("hour", 15);
                        result.start.imply("meridiem", 1);
                    }
                    else if (time3 == "中") {
                        result.start.imply("hour", 12);
                        result.start.imply("meridiem", 1);
                    }
                    else if (time3 == "夜" || time3 == "晚") {
                        result.start.imply("hour", 22);
                        result.start.imply("meridiem", 1);
                    }
                    else if (time3 == "凌") {
                        result.start.imply("hour", 0);
                    }
                }
            }
            result.start.assign("day", startMoment.date());
            result.start.assign("month", startMoment.month() + 1);
            result.start.assign("year", startMoment.year());
            return result;
        }
    }
    ZHHansCasualDateParser$1.default = ZHHansCasualDateParser;

    var ZHHansDateParser$1 = {};

    var constants$2 = {};

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.zhStringToYear = exports.zhStringToNumber = exports.WEEKDAY_OFFSET = exports.NUMBER = void 0;
    	exports.NUMBER = {
    	    "零": 0,
    	    "〇": 0,
    	    "一": 1,
    	    "二": 2,
    	    "两": 2,
    	    "三": 3,
    	    "四": 4,
    	    "五": 5,
    	    "六": 6,
    	    "七": 7,
    	    "八": 8,
    	    "九": 9,
    	    "十": 10,
    	};
    	exports.WEEKDAY_OFFSET = {
    	    "天": 0,
    	    "日": 0,
    	    "一": 1,
    	    "二": 2,
    	    "三": 3,
    	    "四": 4,
    	    "五": 5,
    	    "六": 6,
    	};
    	function zhStringToNumber(text) {
    	    let number = 0;
    	    for (let i = 0; i < text.length; i++) {
    	        const char = text[i];
    	        if (char === "十") {
    	            number = number === 0 ? exports.NUMBER[char] : number * exports.NUMBER[char];
    	        }
    	        else {
    	            number += exports.NUMBER[char];
    	        }
    	    }
    	    return number;
    	}
    	exports.zhStringToNumber = zhStringToNumber;
    	function zhStringToYear(text) {
    	    let string = "";
    	    for (let i = 0; i < text.length; i++) {
    	        const char = text[i];
    	        string = string + exports.NUMBER[char];
    	    }
    	    return parseInt(string);
    	}
    	exports.zhStringToYear = zhStringToYear;
    	
    } (constants$2));

    var __importDefault$7 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHansDateParser$1, "__esModule", { value: true });
    const dayjs_1$4 = __importDefault$7(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$7 = AbstractParserWithWordBoundary;
    const constants_1$7 = constants$2;
    const YEAR_GROUP$3 = 1;
    const MONTH_GROUP = 2;
    const DAY_GROUP = 3;
    class ZHHansDateParser extends AbstractParserWithWordBoundary_1$7.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return new RegExp("(" +
                "\\d{2,4}|" +
                "[" +
                Object.keys(constants_1$7.NUMBER).join("") +
                "]{4}|" +
                "[" +
                Object.keys(constants_1$7.NUMBER).join("") +
                "]{2}" +
                ")?" +
                "(?:\\s*)" +
                "(?:年)?" +
                "(?:[\\s|,|，]*)" +
                "(" +
                "\\d{1,2}|" +
                "[" +
                Object.keys(constants_1$7.NUMBER).join("") +
                "]{1,3}" +
                ")" +
                "(?:\\s*)" +
                "(?:月)" +
                "(?:\\s*)" +
                "(" +
                "\\d{1,2}|" +
                "[" +
                Object.keys(constants_1$7.NUMBER).join("") +
                "]{1,3}" +
                ")?" +
                "(?:\\s*)" +
                "(?:日|号)?");
        }
        innerExtract(context, match) {
            const startMoment = dayjs_1$4.default(context.refDate);
            const result = context.createParsingResult(match.index, match[0]);
            let month = parseInt(match[MONTH_GROUP]);
            if (isNaN(month))
                month = constants_1$7.zhStringToNumber(match[MONTH_GROUP]);
            result.start.assign("month", month);
            if (match[DAY_GROUP]) {
                let day = parseInt(match[DAY_GROUP]);
                if (isNaN(day))
                    day = constants_1$7.zhStringToNumber(match[DAY_GROUP]);
                result.start.assign("day", day);
            }
            else {
                result.start.imply("day", startMoment.date());
            }
            if (match[YEAR_GROUP$3]) {
                let year = parseInt(match[YEAR_GROUP$3]);
                if (isNaN(year))
                    year = constants_1$7.zhStringToYear(match[YEAR_GROUP$3]);
                result.start.assign("year", year);
            }
            else {
                result.start.imply("year", startMoment.year());
            }
            return result;
        }
    }
    ZHHansDateParser$1.default = ZHHansDateParser;

    var ZHHansDeadlineFormatParser$1 = {};

    var __importDefault$6 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHansDeadlineFormatParser$1, "__esModule", { value: true });
    const dayjs_1$3 = __importDefault$6(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$6 = AbstractParserWithWordBoundary;
    const constants_1$6 = constants$2;
    const PATTERN$5 = new RegExp("(\\d+|[" +
        Object.keys(constants_1$6.NUMBER).join("") +
        "]+|半|几)(?:\\s*)" +
        "(?:个)?" +
        "(秒(?:钟)?|分钟|小时|钟|日|天|星期|礼拜|月|年)" +
        "(?:(?:之|过)?后|(?:之)?内)", "i");
    const NUMBER_GROUP = 1;
    const UNIT_GROUP = 2;
    class ZHHansDeadlineFormatParser extends AbstractParserWithWordBoundary_1$6.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$5;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            let number = parseInt(match[NUMBER_GROUP]);
            if (isNaN(number)) {
                number = constants_1$6.zhStringToNumber(match[NUMBER_GROUP]);
            }
            if (isNaN(number)) {
                const string = match[NUMBER_GROUP];
                if (string === "几") {
                    number = 3;
                }
                else if (string === "半") {
                    number = 0.5;
                }
                else {
                    return null;
                }
            }
            let date = dayjs_1$3.default(context.refDate);
            const unit = match[UNIT_GROUP];
            const unitAbbr = unit[0];
            if (unitAbbr.match(/[日天星礼月年]/)) {
                if (unitAbbr == "日" || unitAbbr == "天") {
                    date = date.add(number, "d");
                }
                else if (unitAbbr == "星" || unitAbbr == "礼") {
                    date = date.add(number * 7, "d");
                }
                else if (unitAbbr == "月") {
                    date = date.add(number, "month");
                }
                else if (unitAbbr == "年") {
                    date = date.add(number, "year");
                }
                result.start.assign("year", date.year());
                result.start.assign("month", date.month() + 1);
                result.start.assign("day", date.date());
                return result;
            }
            if (unitAbbr == "秒") {
                date = date.add(number, "second");
            }
            else if (unitAbbr == "分") {
                date = date.add(number, "minute");
            }
            else if (unitAbbr == "小" || unitAbbr == "钟") {
                date = date.add(number, "hour");
            }
            result.start.imply("year", date.year());
            result.start.imply("month", date.month() + 1);
            result.start.imply("day", date.date());
            result.start.assign("hour", date.hour());
            result.start.assign("minute", date.minute());
            result.start.assign("second", date.second());
            return result;
        }
    }
    ZHHansDeadlineFormatParser$1.default = ZHHansDeadlineFormatParser;

    var ZHHansRelationWeekdayParser$1 = {};

    var __importDefault$5 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHansRelationWeekdayParser$1, "__esModule", { value: true });
    const dayjs_1$2 = __importDefault$5(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$5 = AbstractParserWithWordBoundary;
    const constants_1$5 = constants$2;
    const PATTERN$4 = new RegExp("(?<prefix>上|下|这)(?:个)?(?:星期|礼拜|周)(?<weekday>" + Object.keys(constants_1$5.WEEKDAY_OFFSET).join("|") + ")");
    class ZHHansRelationWeekdayParser extends AbstractParserWithWordBoundary_1$5.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$4;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            const dayOfWeek = match.groups.weekday;
            const offset = constants_1$5.WEEKDAY_OFFSET[dayOfWeek];
            if (offset === undefined)
                return null;
            let modifier = null;
            const prefix = match.groups.prefix;
            if (prefix == "上") {
                modifier = "last";
            }
            else if (prefix == "下") {
                modifier = "next";
            }
            else if (prefix == "这") {
                modifier = "this";
            }
            let startMoment = dayjs_1$2.default(context.refDate);
            let startMomentFixed = false;
            const refOffset = startMoment.day();
            if (modifier == "last" || modifier == "past") {
                startMoment = startMoment.day(offset - 7);
                startMomentFixed = true;
            }
            else if (modifier == "next") {
                startMoment = startMoment.day(offset + 7);
                startMomentFixed = true;
            }
            else if (modifier == "this") {
                startMoment = startMoment.day(offset);
            }
            else {
                if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                    startMoment = startMoment.day(offset - 7);
                }
                else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                    startMoment = startMoment.day(offset + 7);
                }
                else {
                    startMoment = startMoment.day(offset);
                }
            }
            result.start.assign("weekday", offset);
            if (startMomentFixed) {
                result.start.assign("day", startMoment.date());
                result.start.assign("month", startMoment.month() + 1);
                result.start.assign("year", startMoment.year());
            }
            else {
                result.start.imply("day", startMoment.date());
                result.start.imply("month", startMoment.month() + 1);
                result.start.imply("year", startMoment.year());
            }
            return result;
        }
    }
    ZHHansRelationWeekdayParser$1.default = ZHHansRelationWeekdayParser;

    var ZHHansTimeExpressionParser$1 = {};

    var __importDefault$4 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHansTimeExpressionParser$1, "__esModule", { value: true });
    const dayjs_1$1 = __importDefault$4(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$4 = AbstractParserWithWordBoundary;
    const constants_1$4 = constants$2;
    const FIRST_REG_PATTERN = new RegExp("(?:从|自)?" +
        "(?:" +
        "(今|明|前|大前|后|大后|昨)(早|朝|晚)|" +
        "(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
        "(今|明|前|大前|后|大后|昨)(?:日|天)" +
        "(?:[\\s,，]*)" +
        "(?:(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
        ")?" +
        "(?:[\\s,，]*)" +
        "(?:(\\d+|[" +
        Object.keys(constants_1$4.NUMBER).join("") +
        "]+)(?:\\s*)(?:点|时|:|：)" +
        "(?:\\s*)" +
        "(\\d+|半|正|整|[" +
        Object.keys(constants_1$4.NUMBER).join("") +
        "]+)?(?:\\s*)(?:分|:|：)?" +
        "(?:\\s*)" +
        "(\\d+|[" +
        Object.keys(constants_1$4.NUMBER).join("") +
        "]+)?(?:\\s*)(?:秒)?)" +
        "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
    const SECOND_REG_PATTERN = new RegExp("(?:^\\s*(?:到|至|\\-|\\–|\\~|\\〜)\\s*)" +
        "(?:" +
        "(今|明|前|大前|后|大后|昨)(早|朝|晚)|" +
        "(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
        "(今|明|前|大前|后|大后|昨)(?:日|天)" +
        "(?:[\\s,，]*)" +
        "(?:(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
        ")?" +
        "(?:[\\s,，]*)" +
        "(?:(\\d+|[" +
        Object.keys(constants_1$4.NUMBER).join("") +
        "]+)(?:\\s*)(?:点|时|:|：)" +
        "(?:\\s*)" +
        "(\\d+|半|正|整|[" +
        Object.keys(constants_1$4.NUMBER).join("") +
        "]+)?(?:\\s*)(?:分|:|：)?" +
        "(?:\\s*)" +
        "(\\d+|[" +
        Object.keys(constants_1$4.NUMBER).join("") +
        "]+)?(?:\\s*)(?:秒)?)" +
        "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
    const DAY_GROUP_1 = 1;
    const ZH_AM_PM_HOUR_GROUP_1 = 2;
    const ZH_AM_PM_HOUR_GROUP_2 = 3;
    const DAY_GROUP_3 = 4;
    const ZH_AM_PM_HOUR_GROUP_3 = 5;
    const HOUR_GROUP = 6;
    const MINUTE_GROUP = 7;
    const SECOND_GROUP = 8;
    const AM_PM_HOUR_GROUP = 9;
    class ZHHansTimeExpressionParser extends AbstractParserWithWordBoundary_1$4.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return FIRST_REG_PATTERN;
        }
        innerExtract(context, match) {
            if (match.index > 0 && context.text[match.index - 1].match(/\w/)) {
                return null;
            }
            const refMoment = dayjs_1$1.default(context.refDate);
            const result = context.createParsingResult(match.index, match[0]);
            let startMoment = refMoment.clone();
            if (match[DAY_GROUP_1]) {
                const day1 = match[DAY_GROUP_1];
                if (day1 == "明") {
                    if (refMoment.hour() > 1) {
                        startMoment = startMoment.add(1, "day");
                    }
                }
                else if (day1 == "昨") {
                    startMoment = startMoment.add(-1, "day");
                }
                else if (day1 == "前") {
                    startMoment = startMoment.add(-2, "day");
                }
                else if (day1 == "大前") {
                    startMoment = startMoment.add(-3, "day");
                }
                else if (day1 == "后") {
                    startMoment = startMoment.add(2, "day");
                }
                else if (day1 == "大后") {
                    startMoment = startMoment.add(3, "day");
                }
                result.start.assign("day", startMoment.date());
                result.start.assign("month", startMoment.month() + 1);
                result.start.assign("year", startMoment.year());
            }
            else if (match[DAY_GROUP_3]) {
                const day3 = match[DAY_GROUP_3];
                if (day3 == "明") {
                    startMoment = startMoment.add(1, "day");
                }
                else if (day3 == "昨") {
                    startMoment = startMoment.add(-1, "day");
                }
                else if (day3 == "前") {
                    startMoment = startMoment.add(-2, "day");
                }
                else if (day3 == "大前") {
                    startMoment = startMoment.add(-3, "day");
                }
                else if (day3 == "后") {
                    startMoment = startMoment.add(2, "day");
                }
                else if (day3 == "大后") {
                    startMoment = startMoment.add(3, "day");
                }
                result.start.assign("day", startMoment.date());
                result.start.assign("month", startMoment.month() + 1);
                result.start.assign("year", startMoment.year());
            }
            else {
                result.start.imply("day", startMoment.date());
                result.start.imply("month", startMoment.month() + 1);
                result.start.imply("year", startMoment.year());
            }
            let hour = 0;
            let minute = 0;
            let meridiem = -1;
            if (match[SECOND_GROUP]) {
                let second = parseInt(match[SECOND_GROUP]);
                if (isNaN(second)) {
                    second = constants_1$4.zhStringToNumber(match[SECOND_GROUP]);
                }
                if (second >= 60)
                    return null;
                result.start.assign("second", second);
            }
            hour = parseInt(match[HOUR_GROUP]);
            if (isNaN(hour)) {
                hour = constants_1$4.zhStringToNumber(match[HOUR_GROUP]);
            }
            if (match[MINUTE_GROUP]) {
                if (match[MINUTE_GROUP] == "半") {
                    minute = 30;
                }
                else if (match[MINUTE_GROUP] == "正" || match[MINUTE_GROUP] == "整") {
                    minute = 0;
                }
                else {
                    minute = parseInt(match[MINUTE_GROUP]);
                    if (isNaN(minute)) {
                        minute = constants_1$4.zhStringToNumber(match[MINUTE_GROUP]);
                    }
                }
            }
            else if (hour > 100) {
                minute = hour % 100;
                hour = Math.floor(hour / 100);
            }
            if (minute >= 60) {
                return null;
            }
            if (hour > 24) {
                return null;
            }
            if (hour >= 12) {
                meridiem = 1;
            }
            if (match[AM_PM_HOUR_GROUP]) {
                if (hour > 12)
                    return null;
                const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                if (ampm == "a") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                if (ampm == "p") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
                const zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
                const zhAMPM1 = zhAMPMString1[0];
                if (zhAMPM1 == "早") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM1 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
                const zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
                const zhAMPM2 = zhAMPMString2[0];
                if (zhAMPM2 == "上" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM2 == "下" || zhAMPM2 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
                const zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
                const zhAMPM3 = zhAMPMString3[0];
                if (zhAMPM3 == "上" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM3 == "下" || zhAMPM3 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            result.start.assign("hour", hour);
            result.start.assign("minute", minute);
            if (meridiem >= 0) {
                result.start.assign("meridiem", meridiem);
            }
            else {
                if (hour < 12) {
                    result.start.imply("meridiem", 0);
                }
                else {
                    result.start.imply("meridiem", 1);
                }
            }
            match = SECOND_REG_PATTERN.exec(context.text.substring(result.index + result.text.length));
            if (!match) {
                if (result.text.match(/^\d+$/)) {
                    return null;
                }
                return result;
            }
            let endMoment = startMoment.clone();
            result.end = context.createParsingComponents();
            if (match[DAY_GROUP_1]) {
                const day1 = match[DAY_GROUP_1];
                if (day1 == "明") {
                    if (refMoment.hour() > 1) {
                        endMoment = endMoment.add(1, "day");
                    }
                }
                else if (day1 == "昨") {
                    endMoment = endMoment.add(-1, "day");
                }
                else if (day1 == "前") {
                    endMoment = endMoment.add(-2, "day");
                }
                else if (day1 == "大前") {
                    endMoment = endMoment.add(-3, "day");
                }
                else if (day1 == "后") {
                    endMoment = endMoment.add(2, "day");
                }
                else if (day1 == "大后") {
                    endMoment = endMoment.add(3, "day");
                }
                result.end.assign("day", endMoment.date());
                result.end.assign("month", endMoment.month() + 1);
                result.end.assign("year", endMoment.year());
            }
            else if (match[DAY_GROUP_3]) {
                const day3 = match[DAY_GROUP_3];
                if (day3 == "明") {
                    endMoment = endMoment.add(1, "day");
                }
                else if (day3 == "昨") {
                    endMoment = endMoment.add(-1, "day");
                }
                else if (day3 == "前") {
                    endMoment = endMoment.add(-2, "day");
                }
                else if (day3 == "大前") {
                    endMoment = endMoment.add(-3, "day");
                }
                else if (day3 == "后") {
                    endMoment = endMoment.add(2, "day");
                }
                else if (day3 == "大后") {
                    endMoment = endMoment.add(3, "day");
                }
                result.end.assign("day", endMoment.date());
                result.end.assign("month", endMoment.month() + 1);
                result.end.assign("year", endMoment.year());
            }
            else {
                result.end.imply("day", endMoment.date());
                result.end.imply("month", endMoment.month() + 1);
                result.end.imply("year", endMoment.year());
            }
            hour = 0;
            minute = 0;
            meridiem = -1;
            if (match[SECOND_GROUP]) {
                let second = parseInt(match[SECOND_GROUP]);
                if (isNaN(second)) {
                    second = constants_1$4.zhStringToNumber(match[SECOND_GROUP]);
                }
                if (second >= 60)
                    return null;
                result.end.assign("second", second);
            }
            hour = parseInt(match[HOUR_GROUP]);
            if (isNaN(hour)) {
                hour = constants_1$4.zhStringToNumber(match[HOUR_GROUP]);
            }
            if (match[MINUTE_GROUP]) {
                if (match[MINUTE_GROUP] == "半") {
                    minute = 30;
                }
                else if (match[MINUTE_GROUP] == "正" || match[MINUTE_GROUP] == "整") {
                    minute = 0;
                }
                else {
                    minute = parseInt(match[MINUTE_GROUP]);
                    if (isNaN(minute)) {
                        minute = constants_1$4.zhStringToNumber(match[MINUTE_GROUP]);
                    }
                }
            }
            else if (hour > 100) {
                minute = hour % 100;
                hour = Math.floor(hour / 100);
            }
            if (minute >= 60) {
                return null;
            }
            if (hour > 24) {
                return null;
            }
            if (hour >= 12) {
                meridiem = 1;
            }
            if (match[AM_PM_HOUR_GROUP]) {
                if (hour > 12)
                    return null;
                const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                if (ampm == "a") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                if (ampm == "p") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
                if (!result.start.isCertain("meridiem")) {
                    if (meridiem == 0) {
                        result.start.imply("meridiem", 0);
                        if (result.start.get("hour") == 12) {
                            result.start.assign("hour", 0);
                        }
                    }
                    else {
                        result.start.imply("meridiem", 1);
                        if (result.start.get("hour") != 12) {
                            result.start.assign("hour", result.start.get("hour") + 12);
                        }
                    }
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
                const zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
                const zhAMPM1 = zhAMPMString1[0];
                if (zhAMPM1 == "早") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM1 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
                const zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
                const zhAMPM2 = zhAMPMString2[0];
                if (zhAMPM2 == "上" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM2 == "下" || zhAMPM2 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
                const zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
                const zhAMPM3 = zhAMPMString3[0];
                if (zhAMPM3 == "上" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                    meridiem = 0;
                    if (hour == 12)
                        hour = 0;
                }
                else if (zhAMPM3 == "下" || zhAMPM3 == "晚") {
                    meridiem = 1;
                    if (hour != 12)
                        hour += 12;
                }
            }
            result.text = result.text + match[0];
            result.end.assign("hour", hour);
            result.end.assign("minute", minute);
            if (meridiem >= 0) {
                result.end.assign("meridiem", meridiem);
            }
            else {
                const startAtPM = result.start.isCertain("meridiem") && result.start.get("meridiem") == 1;
                if (startAtPM && result.start.get("hour") > hour) {
                    result.end.imply("meridiem", 0);
                }
                else if (hour > 12) {
                    result.end.imply("meridiem", 1);
                }
            }
            if (result.end.date().getTime() < result.start.date().getTime()) {
                result.end.imply("day", result.end.get("day") + 1);
            }
            return result;
        }
    }
    ZHHansTimeExpressionParser$1.default = ZHHansTimeExpressionParser;

    var ZHHansWeekdayParser$1 = {};

    var __importDefault$3 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHansWeekdayParser$1, "__esModule", { value: true });
    const dayjs_1 = __importDefault$3(dayjs_minExports);
    const AbstractParserWithWordBoundary_1$3 = AbstractParserWithWordBoundary;
    const constants_1$3 = constants$2;
    const PATTERN$3 = new RegExp("(?:星期|礼拜|周)(?<weekday>" + Object.keys(constants_1$3.WEEKDAY_OFFSET).join("|") + ")");
    class ZHHansWeekdayParser extends AbstractParserWithWordBoundary_1$3.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN$3;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            const dayOfWeek = match.groups.weekday;
            const offset = constants_1$3.WEEKDAY_OFFSET[dayOfWeek];
            if (offset === undefined)
                return null;
            let startMoment = dayjs_1.default(context.refDate);
            const refOffset = startMoment.day();
            if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                startMoment = startMoment.day(offset - 7);
            }
            else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                startMoment = startMoment.day(offset + 7);
            }
            else {
                startMoment = startMoment.day(offset);
            }
            result.start.assign("weekday", offset);
            {
                result.start.imply("day", startMoment.date());
                result.start.imply("month", startMoment.month() + 1);
                result.start.imply("year", startMoment.year());
            }
            return result;
        }
    }
    ZHHansWeekdayParser$1.default = ZHHansWeekdayParser;

    var ZHHansMergeDateRangeRefiner$1 = {};

    var __importDefault$2 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ZHHansMergeDateRangeRefiner$1, "__esModule", { value: true });
    const AbstractMergeDateRangeRefiner_1$2 = __importDefault$2(AbstractMergeDateRangeRefiner$1);
    class ZHHansMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$2.default {
        patternBetween() {
            return /^\s*(至|到|-|~|～|－|ー)\s*$/i;
        }
    }
    ZHHansMergeDateRangeRefiner$1.default = ZHHansMergeDateRangeRefiner;

    var ZHHansMergeDateTimeRefiner = {};

    var hasRequiredZHHansMergeDateTimeRefiner;

    function requireZHHansMergeDateTimeRefiner () {
    	if (hasRequiredZHHansMergeDateTimeRefiner) return ZHHansMergeDateTimeRefiner;
    	hasRequiredZHHansMergeDateTimeRefiner = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(ZHHansMergeDateTimeRefiner, "__esModule", { value: true });
    	const AbstractMergeDateTimeRefiner_1 = __importDefault(requireAbstractMergeDateTimeRefiner());
    	let ZHHansMergeDateTimeRefiner$1 = class ZHHansMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    	    patternBetween() {
    	        return /^\s*$/i;
    	    }
    	};
    	ZHHansMergeDateTimeRefiner.default = ZHHansMergeDateTimeRefiner$1;
    	
    	return ZHHansMergeDateTimeRefiner;
    }

    var hasRequiredHans;

    function requireHans () {
    	if (hasRequiredHans) return hans;
    	hasRequiredHans = 1;
    	(function (exports) {
    		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    		    return (mod && mod.__esModule) ? mod : { "default": mod };
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.hans = void 0;
    		const chrono_1 = requireChrono();
    		const ExtractTimezoneOffsetRefiner_1 = __importDefault(ExtractTimezoneOffsetRefiner$1);
    		const configurations_1 = requireConfigurations();
    		const ZHHansCasualDateParser_1 = __importDefault(ZHHansCasualDateParser$1);
    		const ZHHansDateParser_1 = __importDefault(ZHHansDateParser$1);
    		const ZHHansDeadlineFormatParser_1 = __importDefault(ZHHansDeadlineFormatParser$1);
    		const ZHHansRelationWeekdayParser_1 = __importDefault(ZHHansRelationWeekdayParser$1);
    		const ZHHansTimeExpressionParser_1 = __importDefault(ZHHansTimeExpressionParser$1);
    		const ZHHansWeekdayParser_1 = __importDefault(ZHHansWeekdayParser$1);
    		const ZHHansMergeDateRangeRefiner_1 = __importDefault(ZHHansMergeDateRangeRefiner$1);
    		const ZHHansMergeDateTimeRefiner_1 = __importDefault(requireZHHansMergeDateTimeRefiner());
    		exports.hans = new chrono_1.Chrono(createCasualConfiguration());
    		exports.casual = new chrono_1.Chrono(createCasualConfiguration());
    		exports.strict = new chrono_1.Chrono(createConfiguration());
    		function parse(text, ref, option) {
    		    return exports.casual.parse(text, ref, option);
    		}
    		exports.parse = parse;
    		function parseDate(text, ref, option) {
    		    return exports.casual.parseDate(text, ref, option);
    		}
    		exports.parseDate = parseDate;
    		function createCasualConfiguration() {
    		    const option = createConfiguration();
    		    option.parsers.unshift(new ZHHansCasualDateParser_1.default());
    		    return option;
    		}
    		exports.createCasualConfiguration = createCasualConfiguration;
    		function createConfiguration() {
    		    const configuration = configurations_1.includeCommonConfiguration({
    		        parsers: [
    		            new ZHHansDateParser_1.default(),
    		            new ZHHansRelationWeekdayParser_1.default(),
    		            new ZHHansWeekdayParser_1.default(),
    		            new ZHHansTimeExpressionParser_1.default(),
    		            new ZHHansDeadlineFormatParser_1.default(),
    		        ],
    		        refiners: [new ZHHansMergeDateRangeRefiner_1.default(), new ZHHansMergeDateTimeRefiner_1.default()],
    		    });
    		    configuration.refiners = configuration.refiners.filter((refiner) => !(refiner instanceof ExtractTimezoneOffsetRefiner_1.default));
    		    return configuration;
    		}
    		exports.createConfiguration = createConfiguration;
    		
    } (hans));
    	return hans;
    }

    var hasRequiredZh;

    function requireZh () {
    	if (hasRequiredZh) return zh;
    	hasRequiredZh = 1;
    	(function (exports) {
    		var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    		    if (k2 === undefined) k2 = k;
    		    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    		}) : (function(o, m, k, k2) {
    		    if (k2 === undefined) k2 = k;
    		    o[k2] = m[k];
    		}));
    		var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    		    Object.defineProperty(o, "default", { enumerable: true, value: v });
    		}) : function(o, v) {
    		    o["default"] = v;
    		});
    		var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    		};
    		var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    		    if (mod && mod.__esModule) return mod;
    		    var result = {};
    		    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    		    __setModuleDefault(result, mod);
    		    return result;
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.hans = void 0;
    		__exportStar(requireHant(), exports);
    		exports.hans = __importStar(requireHans());
    		
    } (zh));
    	return zh;
    }

    var ru = {};

    var RUTimeUnitWithinFormatParser = {};

    var constants$1 = {};

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.FULL_MONTH_NAME_DICTIONARY = exports.WEEKDAY_DICTIONARY = exports.REGEX_PARTS = void 0;
    	const pattern_1 = pattern;
    	const years_1 = years;
    	exports.REGEX_PARTS = {
    	    leftBoundary: "([^\\p{L}\\p{N}_]|^)",
    	    rightBoundary: "(?=[^\\p{L}\\p{N}_]|$)",
    	    flags: "iu",
    	};
    	exports.WEEKDAY_DICTIONARY = {
    	    воскресенье: 0,
    	    воскресенья: 0,
    	    вск: 0,
    	    "вск.": 0,
    	    понедельник: 1,
    	    понедельника: 1,
    	    пн: 1,
    	    "пн.": 1,
    	    вторник: 2,
    	    вторника: 2,
    	    вт: 2,
    	    "вт.": 2,
    	    среда: 3,
    	    среды: 3,
    	    среду: 3,
    	    ср: 3,
    	    "ср.": 3,
    	    четверг: 4,
    	    четверга: 4,
    	    чт: 4,
    	    "чт.": 4,
    	    пятница: 5,
    	    пятницу: 5,
    	    пятницы: 5,
    	    пт: 5,
    	    "пт.": 5,
    	    суббота: 6,
    	    субботу: 6,
    	    субботы: 6,
    	    сб: 6,
    	    "сб.": 6,
    	};
    	exports.FULL_MONTH_NAME_DICTIONARY = {
    	    январь: 1,
    	    января: 1,
    	    январе: 1,
    	    февраль: 2,
    	    февраля: 2,
    	    феврале: 2,
    	    март: 3,
    	    марта: 3,
    	    марте: 3,
    	    апрель: 4,
    	    апреля: 4,
    	    апреле: 4,
    	    май: 5,
    	    мая: 5,
    	    мае: 5,
    	    июнь: 6,
    	    июня: 6,
    	    июне: 6,
    	    июль: 7,
    	    июля: 7,
    	    июле: 7,
    	    август: 8,
    	    августа: 8,
    	    августе: 8,
    	    сентябрь: 9,
    	    сентября: 9,
    	    сентябре: 9,
    	    октябрь: 10,
    	    октября: 10,
    	    октябре: 10,
    	    ноябрь: 11,
    	    ноября: 11,
    	    ноябре: 11,
    	    декабрь: 12,
    	    декабря: 12,
    	    декабре: 12,
    	};
    	exports.MONTH_DICTIONARY = Object.assign(Object.assign({}, exports.FULL_MONTH_NAME_DICTIONARY), { янв: 1, "янв.": 1, фев: 2, "фев.": 2, мар: 3, "мар.": 3, апр: 4, "апр.": 4, авг: 8, "авг.": 8, сен: 9, "сен.": 9, окт: 10, "окт.": 10, ноя: 11, "ноя.": 11, дек: 12, "дек.": 12 });
    	exports.INTEGER_WORD_DICTIONARY = {
    	    один: 1,
    	    одна: 1,
    	    одной: 1,
    	    одну: 1,
    	    две: 2,
    	    два: 2,
    	    двух: 2,
    	    три: 3,
    	    трех: 3,
    	    трёх: 3,
    	    четыре: 4,
    	    четырех: 4,
    	    четырёх: 4,
    	    пять: 5,
    	    пяти: 5,
    	    шесть: 6,
    	    шести: 6,
    	    семь: 7,
    	    семи: 7,
    	    восемь: 8,
    	    восьми: 8,
    	    девять: 9,
    	    девяти: 9,
    	    десять: 10,
    	    десяти: 10,
    	    одиннадцать: 11,
    	    одиннадцати: 11,
    	    двенадцать: 12,
    	    двенадцати: 12,
    	};
    	exports.ORDINAL_WORD_DICTIONARY = {
    	    первое: 1,
    	    первого: 1,
    	    второе: 2,
    	    второго: 2,
    	    третье: 3,
    	    третьего: 3,
    	    четвертое: 4,
    	    четвертого: 4,
    	    пятое: 5,
    	    пятого: 5,
    	    шестое: 6,
    	    шестого: 6,
    	    седьмое: 7,
    	    седьмого: 7,
    	    восьмое: 8,
    	    восьмого: 8,
    	    девятое: 9,
    	    девятого: 9,
    	    десятое: 10,
    	    десятого: 10,
    	    одиннадцатое: 11,
    	    одиннадцатого: 11,
    	    двенадцатое: 12,
    	    двенадцатого: 12,
    	    тринадцатое: 13,
    	    тринадцатого: 13,
    	    четырнадцатое: 14,
    	    четырнадцатого: 14,
    	    пятнадцатое: 15,
    	    пятнадцатого: 15,
    	    шестнадцатое: 16,
    	    шестнадцатого: 16,
    	    семнадцатое: 17,
    	    семнадцатого: 17,
    	    восемнадцатое: 18,
    	    восемнадцатого: 18,
    	    девятнадцатое: 19,
    	    девятнадцатого: 19,
    	    двадцатое: 20,
    	    двадцатого: 20,
    	    "двадцать первое": 21,
    	    "двадцать первого": 21,
    	    "двадцать второе": 22,
    	    "двадцать второго": 22,
    	    "двадцать третье": 23,
    	    "двадцать третьего": 23,
    	    "двадцать четвертое": 24,
    	    "двадцать четвертого": 24,
    	    "двадцать пятое": 25,
    	    "двадцать пятого": 25,
    	    "двадцать шестое": 26,
    	    "двадцать шестого": 26,
    	    "двадцать седьмое": 27,
    	    "двадцать седьмого": 27,
    	    "двадцать восьмое": 28,
    	    "двадцать восьмого": 28,
    	    "двадцать девятое": 29,
    	    "двадцать девятого": 29,
    	    "тридцатое": 30,
    	    "тридцатого": 30,
    	    "тридцать первое": 31,
    	    "тридцать первого": 31,
    	};
    	exports.TIME_UNIT_DICTIONARY = {
    	    сек: "second",
    	    секунда: "second",
    	    секунд: "second",
    	    секунды: "second",
    	    секунду: "second",
    	    секундочка: "second",
    	    секундочки: "second",
    	    секундочек: "second",
    	    секундочку: "second",
    	    мин: "minute",
    	    минута: "minute",
    	    минут: "minute",
    	    минуты: "minute",
    	    минуту: "minute",
    	    минуток: "minute",
    	    минутки: "minute",
    	    минутку: "minute",
    	    час: "hour",
    	    часов: "hour",
    	    часа: "hour",
    	    часу: "hour",
    	    часиков: "hour",
    	    часика: "hour",
    	    часике: "hour",
    	    часик: "hour",
    	    день: "d",
    	    дня: "d",
    	    дней: "d",
    	    суток: "d",
    	    сутки: "d",
    	    неделя: "week",
    	    неделе: "week",
    	    недели: "week",
    	    неделю: "week",
    	    недель: "week",
    	    недельке: "week",
    	    недельки: "week",
    	    неделек: "week",
    	    месяц: "month",
    	    месяце: "month",
    	    месяцев: "month",
    	    месяца: "month",
    	    квартал: "quarter",
    	    квартале: "quarter",
    	    кварталов: "quarter",
    	    год: "year",
    	    года: "year",
    	    году: "year",
    	    годов: "year",
    	    лет: "year",
    	    годик: "year",
    	    годика: "year",
    	    годиков: "year",
    	};
    	exports.NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|пол|несколько|пар(?:ы|у)|\\s{0,3})`;
    	function parseNumberPattern(match) {
    	    const num = match.toLowerCase();
    	    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
    	        return exports.INTEGER_WORD_DICTIONARY[num];
    	    }
    	    if (num.match(/несколько/)) {
    	        return 3;
    	    }
    	    else if (num.match(/пол/)) {
    	        return 0.5;
    	    }
    	    else if (num.match(/пар/)) {
    	        return 2;
    	    }
    	    else if (num === "") {
    	        return 1;
    	    }
    	    return parseFloat(num);
    	}
    	exports.parseNumberPattern = parseNumberPattern;
    	exports.ORDINAL_NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:го|ого|е|ое)?)`;
    	function parseOrdinalNumberPattern(match) {
    	    let num = match.toLowerCase();
    	    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
    	        return exports.ORDINAL_WORD_DICTIONARY[num];
    	    }
    	    return parseInt(num);
    	}
    	exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
    	const year = "(?:\\s+(?:году|года|год|г|г.))?";
    	exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}${year}\\s*(?:н.э.|до н.э.|н. э.|до н. э.)|[1-2][0-9]{3}${year}|[5-9][0-9]${year})`;
    	function parseYear(match) {
    	    if (/(год|года|г|г.)/i.test(match)) {
    	        match = match.replace(/(год|года|г|г.)/i, "");
    	    }
    	    if (/(до н.э.|до н. э.)/i.test(match)) {
    	        match = match.replace(/(до н.э.|до н. э.)/i, "");
    	        return -parseInt(match);
    	    }
    	    if (/(н. э.|н.э.)/i.test(match)) {
    	        match = match.replace(/(н. э.|н.э.)/i, "");
    	        return parseInt(match);
    	    }
    	    const rawYearNumber = parseInt(match);
    	    return years_1.findMostLikelyADYear(rawYearNumber);
    	}
    	exports.parseYear = parseYear;
    	const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,3}(${pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})`;
    	const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
    	exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern(`(?:(?:около|примерно)\\s{0,3})?`, SINGLE_TIME_UNIT_PATTERN);
    	function parseTimeUnits(timeunitText) {
    	    const fragments = {};
    	    let remainingText = timeunitText;
    	    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    while (match) {
    	        collectDateTimeFragment(fragments, match);
    	        remainingText = remainingText.substring(match[0].length).trim();
    	        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    }
    	    return fragments;
    	}
    	exports.parseTimeUnits = parseTimeUnits;
    	function collectDateTimeFragment(fragments, match) {
    	    const num = parseNumberPattern(match[1]);
    	    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    	    fragments[unit] = num;
    	}
    	
    } (constants$1));

    var hasRequiredRUTimeUnitWithinFormatParser;

    function requireRUTimeUnitWithinFormatParser () {
    	if (hasRequiredRUTimeUnitWithinFormatParser) return RUTimeUnitWithinFormatParser;
    	hasRequiredRUTimeUnitWithinFormatParser = 1;
    	Object.defineProperty(RUTimeUnitWithinFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$1;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const PATTERN = `(?:(?:около|примерно)\\s*(?:~\\s*)?)?(${constants_1.TIME_UNITS_PATTERN})${constants_1.REGEX_PARTS.rightBoundary}`;
    	const PATTERN_WITH_PREFIX = new RegExp(`(?:в течение|в течении)\\s*${PATTERN}`, constants_1.REGEX_PARTS.flags);
    	const PATTERN_WITHOUT_PREFIX = new RegExp(PATTERN, "i");
    	let RUTimeUnitWithinFormatParser$1 = class RUTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    patternLeftBoundary() {
    	        return constants_1.REGEX_PARTS.leftBoundary;
    	    }
    	    innerPattern(context) {
    	        return context.option.forwardDate ? PATTERN_WITHOUT_PREFIX : PATTERN_WITH_PREFIX;
    	    }
    	    innerExtract(context, match) {
    	        const timeUnits = constants_1.parseTimeUnits(match[1]);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	    }
    	};
    	RUTimeUnitWithinFormatParser.default = RUTimeUnitWithinFormatParser$1;
    	
    	return RUTimeUnitWithinFormatParser;
    }

    var RUMonthNameLittleEndianParser$1 = {};

    Object.defineProperty(RUMonthNameLittleEndianParser$1, "__esModule", { value: true });
    const years_1$2 = years;
    const constants_1$2 = constants$1;
    const constants_2$2 = constants$1;
    const constants_3 = constants$1;
    const pattern_1$2 = pattern;
    const AbstractParserWithWordBoundary_1$2 = AbstractParserWithWordBoundary;
    const PATTERN$2 = new RegExp(`(?:с)?\\s*(${constants_3.ORDINAL_NUMBER_PATTERN})` +
        `(?:` +
        `\\s{0,3}(?:по|-|–|до)?\\s{0,3}` +
        `(${constants_3.ORDINAL_NUMBER_PATTERN})` +
        `)?` +
        `(?:-|\\/|\\s{0,3}(?:of)?\\s{0,3})` +
        `(${pattern_1$2.matchAnyPattern(constants_1$2.MONTH_DICTIONARY)})` +
        `(?:` +
        `(?:-|\\/|,?\\s{0,3})` +
        `(${constants_2$2.YEAR_PATTERN}(?![^\\s]\\d))` +
        `)?` +
        `${constants_1$2.REGEX_PARTS.rightBoundary}`, constants_1$2.REGEX_PARTS.flags);
    const DATE_GROUP$1 = 1;
    const DATE_TO_GROUP$1 = 2;
    const MONTH_NAME_GROUP$2 = 3;
    const YEAR_GROUP$2 = 4;
    class RUMonthNameLittleEndianParser extends AbstractParserWithWordBoundary_1$2.AbstractParserWithWordBoundaryChecking {
        patternLeftBoundary() {
            return constants_1$2.REGEX_PARTS.leftBoundary;
        }
        innerPattern() {
            return PATTERN$2;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            const month = constants_1$2.MONTH_DICTIONARY[match[MONTH_NAME_GROUP$2].toLowerCase()];
            const day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP$1]);
            if (day > 31) {
                match.index = match.index + match[DATE_GROUP$1].length;
                return null;
            }
            result.start.assign("month", month);
            result.start.assign("day", day);
            if (match[YEAR_GROUP$2]) {
                const yearNumber = constants_2$2.parseYear(match[YEAR_GROUP$2]);
                result.start.assign("year", yearNumber);
            }
            else {
                const year = years_1$2.findYearClosestToRef(context.refDate, day, month);
                result.start.imply("year", year);
            }
            if (match[DATE_TO_GROUP$1]) {
                const endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP$1]);
                result.end = result.start.clone();
                result.end.assign("day", endDate);
            }
            return result;
        }
    }
    RUMonthNameLittleEndianParser$1.default = RUMonthNameLittleEndianParser;

    var RUMonthNameParser$1 = {};

    Object.defineProperty(RUMonthNameParser$1, "__esModule", { value: true });
    const constants_1$1 = constants$1;
    const years_1$1 = years;
    const pattern_1$1 = pattern;
    const constants_2$1 = constants$1;
    const AbstractParserWithWordBoundary_1$1 = AbstractParserWithWordBoundary;
    const PATTERN$1 = new RegExp(`((?:в)\\s*)?` +
        `(${pattern_1$1.matchAnyPattern(constants_1$1.MONTH_DICTIONARY)})` +
        `\\s*` +
        `(?:` +
        `[,-]?\\s*(${constants_2$1.YEAR_PATTERN})?` +
        `)?` +
        `(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`, constants_1$1.REGEX_PARTS.flags);
    const MONTH_NAME_GROUP$1 = 2;
    const YEAR_GROUP$1 = 3;
    class RUMonthNameParser extends AbstractParserWithWordBoundary_1$1.AbstractParserWithWordBoundaryChecking {
        patternLeftBoundary() {
            return constants_1$1.REGEX_PARTS.leftBoundary;
        }
        innerPattern() {
            return PATTERN$1;
        }
        innerExtract(context, match) {
            const monthName = match[MONTH_NAME_GROUP$1].toLowerCase();
            if (match[0].length <= 3 && !constants_1$1.FULL_MONTH_NAME_DICTIONARY[monthName]) {
                return null;
            }
            const result = context.createParsingResult(match.index, match.index + match[0].length);
            result.start.imply("day", 1);
            const month = constants_1$1.MONTH_DICTIONARY[monthName];
            result.start.assign("month", month);
            if (match[YEAR_GROUP$1]) {
                const year = constants_2$1.parseYear(match[YEAR_GROUP$1]);
                result.start.assign("year", year);
            }
            else {
                const year = years_1$1.findYearClosestToRef(context.refDate, 1, month);
                result.start.imply("year", year);
            }
            return result;
        }
    }
    RUMonthNameParser$1.default = RUMonthNameParser;

    var RUTimeExpressionParser = {};

    var hasRequiredRUTimeExpressionParser;

    function requireRUTimeExpressionParser () {
    	if (hasRequiredRUTimeExpressionParser) return RUTimeExpressionParser;
    	hasRequiredRUTimeExpressionParser = 1;
    	Object.defineProperty(RUTimeExpressionParser, "__esModule", { value: true });
    	const index_1 = requireDist();
    	const AbstractTimeExpressionParser_1 = requireAbstractTimeExpressionParser();
    	const constants_1 = constants$1;
    	let RUTimeExpressionParser$1 = class RUTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    	    constructor(strictMode) {
    	        super(strictMode);
    	    }
    	    patternFlags() {
    	        return constants_1.REGEX_PARTS.flags;
    	    }
    	    primaryPatternLeftBoundary() {
    	        return `(^|\\s|T|(?:[^\\p{L}\\p{N}_]))`;
    	    }
    	    followingPhase() {
    	        return `\\s*(?:\\-|\\–|\\~|\\〜|до|и|по|\\?)\\s*`;
    	    }
    	    primaryPrefix() {
    	        return `(?:(?:в|с)\\s*)??`;
    	    }
    	    primarySuffix() {
    	        return `(?:\\s*(?:утра|вечера|после полудня))?(?!\\/)${constants_1.REGEX_PARTS.rightBoundary}`;
    	    }
    	    extractPrimaryTimeComponents(context, match) {
    	        const components = super.extractPrimaryTimeComponents(context, match);
    	        if (components) {
    	            if (match[0].endsWith("вечера")) {
    	                const hour = components.get("hour");
    	                if (hour >= 6 && hour < 12) {
    	                    components.assign("hour", components.get("hour") + 12);
    	                    components.assign("meridiem", index_1.Meridiem.PM);
    	                }
    	                else if (hour < 6) {
    	                    components.assign("meridiem", index_1.Meridiem.AM);
    	                }
    	            }
    	            if (match[0].endsWith("после полудня")) {
    	                components.assign("meridiem", index_1.Meridiem.PM);
    	                const hour = components.get("hour");
    	                if (hour >= 0 && hour <= 6) {
    	                    components.assign("hour", components.get("hour") + 12);
    	                }
    	            }
    	            if (match[0].endsWith("утра")) {
    	                components.assign("meridiem", index_1.Meridiem.AM);
    	                const hour = components.get("hour");
    	                if (hour < 12) {
    	                    components.assign("hour", components.get("hour"));
    	                }
    	            }
    	        }
    	        return components;
    	    }
    	};
    	RUTimeExpressionParser.default = RUTimeExpressionParser$1;
    	
    	return RUTimeExpressionParser;
    }

    var RUTimeUnitAgoFormatParser = {};

    var hasRequiredRUTimeUnitAgoFormatParser;

    function requireRUTimeUnitAgoFormatParser () {
    	if (hasRequiredRUTimeUnitAgoFormatParser) return RUTimeUnitAgoFormatParser;
    	hasRequiredRUTimeUnitAgoFormatParser = 1;
    	Object.defineProperty(RUTimeUnitAgoFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$1;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const timeunits_1 = timeunits;
    	const PATTERN = new RegExp(`(${constants_1.TIME_UNITS_PATTERN})\\s{0,5}назад(?=(?:\\W|$))`, constants_1.REGEX_PARTS.flags);
    	let RUTimeUnitAgoFormatParser$1 = class RUTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    patternLeftBoundary() {
    	        return constants_1.REGEX_PARTS.leftBoundary;
    	    }
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const timeUnits = constants_1.parseTimeUnits(match[1]);
    	        const outputTimeUnits = timeunits_1.reverseTimeUnits(timeUnits);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
    	    }
    	};
    	RUTimeUnitAgoFormatParser.default = RUTimeUnitAgoFormatParser$1;
    	
    	return RUTimeUnitAgoFormatParser;
    }

    var RUMergeDateRangeRefiner$1 = {};

    var __importDefault$1 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(RUMergeDateRangeRefiner$1, "__esModule", { value: true });
    const AbstractMergeDateRangeRefiner_1$1 = __importDefault$1(AbstractMergeDateRangeRefiner$1);
    class RUMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
        patternBetween() {
            return /^\s*(и до|и по|до|по|-)\s*$/i;
        }
    }
    RUMergeDateRangeRefiner$1.default = RUMergeDateRangeRefiner;

    var RUMergeDateTimeRefiner = {};

    var hasRequiredRUMergeDateTimeRefiner;

    function requireRUMergeDateTimeRefiner () {
    	if (hasRequiredRUMergeDateTimeRefiner) return RUMergeDateTimeRefiner;
    	hasRequiredRUMergeDateTimeRefiner = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(RUMergeDateTimeRefiner, "__esModule", { value: true });
    	const AbstractMergeDateTimeRefiner_1 = __importDefault(requireAbstractMergeDateTimeRefiner());
    	let RUMergeDateTimeRefiner$1 = class RUMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    	    patternBetween() {
    	        return new RegExp(`^\\s*(T|в|,|-)?\\s*$`);
    	    }
    	};
    	RUMergeDateTimeRefiner.default = RUMergeDateTimeRefiner$1;
    	
    	return RUMergeDateTimeRefiner;
    }

    var RUCasualDateParser = {};

    var hasRequiredRUCasualDateParser;

    function requireRUCasualDateParser () {
    	if (hasRequiredRUCasualDateParser) return RUCasualDateParser;
    	hasRequiredRUCasualDateParser = 1;
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	Object.defineProperty(RUCasualDateParser, "__esModule", { value: true });
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const references = __importStar(requireCasualReferences());
    	const constants_1 = constants$1;
    	const PATTERN = new RegExp(`(?:с|со)?\\s*(сегодня|вчера|завтра|послезавтра|послепослезавтра|позапозавчера|позавчера)${constants_1.REGEX_PARTS.rightBoundary}`, constants_1.REGEX_PARTS.flags);
    	let RUCasualDateParser$1 = class RUCasualDateParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    patternLeftBoundary() {
    	        return constants_1.REGEX_PARTS.leftBoundary;
    	    }
    	    innerPattern(context) {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const lowerText = match[1].toLowerCase();
    	        const component = context.createParsingComponents();
    	        switch (lowerText) {
    	            case "сегодня":
    	                return references.today(context.reference);
    	            case "вчера":
    	                return references.yesterday(context.reference);
    	            case "завтра":
    	                return references.tomorrow(context.reference);
    	            case "послезавтра":
    	                return references.theDayAfter(context.reference, 2);
    	            case "послепослезавтра":
    	                return references.theDayAfter(context.reference, 3);
    	            case "позавчера":
    	                return references.theDayBefore(context.reference, 2);
    	            case "позапозавчера":
    	                return references.theDayBefore(context.reference, 3);
    	        }
    	        return component;
    	    }
    	};
    	RUCasualDateParser.default = RUCasualDateParser$1;
    	
    	return RUCasualDateParser;
    }

    var RUCasualTimeParser = {};

    var hasRequiredRUCasualTimeParser;

    function requireRUCasualTimeParser () {
    	if (hasRequiredRUCasualTimeParser) return RUCasualTimeParser;
    	hasRequiredRUCasualTimeParser = 1;
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(RUCasualTimeParser, "__esModule", { value: true });
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const references = __importStar(requireCasualReferences());
    	const dayjs_1 = requireDayjs();
    	const dayjs_2 = __importDefault(dayjs_minExports);
    	const constants_1 = constants$1;
    	const PATTERN = new RegExp(`(сейчас|прошлым\\s*вечером|прошлой\\s*ночью|следующей\\s*ночью|сегодня\\s*ночью|этой\\s*ночью|ночью|этим утром|утром|утра|в\\s*полдень|вечером|вечера|в\\s*полночь)` +
    	    `${constants_1.REGEX_PARTS.rightBoundary}`, constants_1.REGEX_PARTS.flags);
    	let RUCasualTimeParser$1 = class RUCasualTimeParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    patternLeftBoundary() {
    	        return constants_1.REGEX_PARTS.leftBoundary;
    	    }
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        let targetDate = dayjs_2.default(context.refDate);
    	        const lowerText = match[0].toLowerCase();
    	        const component = context.createParsingComponents();
    	        if (lowerText === "сейчас") {
    	            return references.now(context.reference);
    	        }
    	        if (lowerText === "вечером" || lowerText === "вечера") {
    	            return references.evening(context.reference);
    	        }
    	        if (lowerText.endsWith("утром") || lowerText.endsWith("утра")) {
    	            return references.morning(context.reference);
    	        }
    	        if (lowerText.match(/в\s*полдень/)) {
    	            return references.noon(context.reference);
    	        }
    	        if (lowerText.match(/прошлой\s*ночью/)) {
    	            return references.lastNight(context.reference);
    	        }
    	        if (lowerText.match(/прошлым\s*вечером/)) {
    	            return references.yesterdayEvening(context.reference);
    	        }
    	        if (lowerText.match(/следующей\s*ночью/)) {
    	            const daysToAdd = targetDate.hour() < 22 ? 1 : 2;
    	            targetDate = targetDate.add(daysToAdd, "day");
    	            dayjs_1.assignSimilarDate(component, targetDate);
    	            component.imply("hour", 0);
    	        }
    	        if (lowerText.match(/в\s*полночь/) || lowerText.endsWith("ночью")) {
    	            return references.midnight(context.reference);
    	        }
    	        return component;
    	    }
    	};
    	RUCasualTimeParser.default = RUCasualTimeParser$1;
    	
    	return RUCasualTimeParser;
    }

    var RUWeekdayParser = {};

    var hasRequiredRUWeekdayParser;

    function requireRUWeekdayParser () {
    	if (hasRequiredRUWeekdayParser) return RUWeekdayParser;
    	hasRequiredRUWeekdayParser = 1;
    	Object.defineProperty(RUWeekdayParser, "__esModule", { value: true });
    	const constants_1 = constants$1;
    	const pattern_1 = pattern;
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const weekdays_1 = requireWeekdays();
    	const PATTERN = new RegExp(`(?:(?:,|\\(|（)\\s*)?` +
    	    `(?:в\\s*?)?` +
    	    `(?:(эту|этот|прошлый|прошлую|следующий|следующую|следующего)\\s*)?` +
    	    `(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})` +
    	    `(?:\\s*(?:,|\\)|）))?` +
    	    `(?:\\s*на\\s*(этой|прошлой|следующей)\\s*неделе)?` +
    	    `${constants_1.REGEX_PARTS.rightBoundary}`, constants_1.REGEX_PARTS.flags);
    	const PREFIX_GROUP = 1;
    	const WEEKDAY_GROUP = 2;
    	const POSTFIX_GROUP = 3;
    	let RUWeekdayParser$1 = class RUWeekdayParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    patternLeftBoundary() {
    	        return constants_1.REGEX_PARTS.leftBoundary;
    	    }
    	    innerExtract(context, match) {
    	        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
    	        const weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
    	        const prefix = match[PREFIX_GROUP];
    	        const postfix = match[POSTFIX_GROUP];
    	        let modifierWord = prefix || postfix;
    	        modifierWord = modifierWord || "";
    	        modifierWord = modifierWord.toLowerCase();
    	        let modifier = null;
    	        if (modifierWord == "прошлый" || modifierWord == "прошлую" || modifierWord == "прошлой") {
    	            modifier = "last";
    	        }
    	        else if (modifierWord == "следующий" ||
    	            modifierWord == "следующую" ||
    	            modifierWord == "следующей" ||
    	            modifierWord == "следующего") {
    	            modifier = "next";
    	        }
    	        else if (modifierWord == "этот" || modifierWord == "эту" || modifierWord == "этой") {
    	            modifier = "this";
    	        }
    	        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    	    }
    	};
    	RUWeekdayParser.default = RUWeekdayParser$1;
    	
    	return RUWeekdayParser;
    }

    var RURelativeDateFormatParser = {};

    var hasRequiredRURelativeDateFormatParser;

    function requireRURelativeDateFormatParser () {
    	if (hasRequiredRURelativeDateFormatParser) return RURelativeDateFormatParser;
    	hasRequiredRURelativeDateFormatParser = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(RURelativeDateFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$1;
    	const results_1 = requireResults();
    	const dayjs_1 = __importDefault(dayjs_minExports);
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const pattern_1 = pattern;
    	const PATTERN = new RegExp(`(в прошлом|на прошлой|на следующей|в следующем|на этой|в этом)\\s*(${pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY)})(?=\\s*)${constants_1.REGEX_PARTS.rightBoundary}`, constants_1.REGEX_PARTS.flags);
    	const MODIFIER_WORD_GROUP = 1;
    	const RELATIVE_WORD_GROUP = 2;
    	let RURelativeDateFormatParser$1 = class RURelativeDateFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    patternLeftBoundary() {
    	        return constants_1.REGEX_PARTS.leftBoundary;
    	    }
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
    	        const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
    	        const timeunit = constants_1.TIME_UNIT_DICTIONARY[unitWord];
    	        if (modifier == "на следующей" || modifier == "в следующем") {
    	            const timeUnits = {};
    	            timeUnits[timeunit] = 1;
    	            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	        }
    	        if (modifier == "в прошлом" || modifier == "на прошлой") {
    	            const timeUnits = {};
    	            timeUnits[timeunit] = -1;
    	            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	        }
    	        const components = context.createParsingComponents();
    	        let date = dayjs_1.default(context.reference.instant);
    	        if (timeunit.match(/week/i)) {
    	            date = date.add(-date.get("d"), "d");
    	            components.imply("day", date.date());
    	            components.imply("month", date.month() + 1);
    	            components.imply("year", date.year());
    	        }
    	        else if (timeunit.match(/month/i)) {
    	            date = date.add(-date.date() + 1, "d");
    	            components.imply("day", date.date());
    	            components.assign("year", date.year());
    	            components.assign("month", date.month() + 1);
    	        }
    	        else if (timeunit.match(/year/i)) {
    	            date = date.add(-date.date() + 1, "d");
    	            date = date.add(-date.month(), "month");
    	            components.imply("day", date.date());
    	            components.imply("month", date.month() + 1);
    	            components.assign("year", date.year());
    	        }
    	        return components;
    	    }
    	};
    	RURelativeDateFormatParser.default = RURelativeDateFormatParser$1;
    	
    	return RURelativeDateFormatParser;
    }

    var RUTimeUnitCasualRelativeFormatParser = {};

    var hasRequiredRUTimeUnitCasualRelativeFormatParser;

    function requireRUTimeUnitCasualRelativeFormatParser () {
    	if (hasRequiredRUTimeUnitCasualRelativeFormatParser) return RUTimeUnitCasualRelativeFormatParser;
    	hasRequiredRUTimeUnitCasualRelativeFormatParser = 1;
    	Object.defineProperty(RUTimeUnitCasualRelativeFormatParser, "__esModule", { value: true });
    	const constants_1 = constants$1;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const timeunits_1 = timeunits;
    	const PATTERN = new RegExp(`(эти|последние|прошлые|следующие|после|спустя|через|\\+|-)\\s*(${constants_1.TIME_UNITS_PATTERN})${constants_1.REGEX_PARTS.rightBoundary}`, constants_1.REGEX_PARTS.flags);
    	let RUTimeUnitCasualRelativeFormatParser$1 = class RUTimeUnitCasualRelativeFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    patternLeftBoundary() {
    	        return constants_1.REGEX_PARTS.leftBoundary;
    	    }
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const prefix = match[1].toLowerCase();
    	        let timeUnits = constants_1.parseTimeUnits(match[2]);
    	        switch (prefix) {
    	            case "последние":
    	            case "прошлые":
    	            case "-":
    	                timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
    	                break;
    	        }
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	    }
    	};
    	RUTimeUnitCasualRelativeFormatParser.default = RUTimeUnitCasualRelativeFormatParser$1;
    	
    	return RUTimeUnitCasualRelativeFormatParser;
    }

    var hasRequiredRu;

    function requireRu () {
    	if (hasRequiredRu) return ru;
    	hasRequiredRu = 1;
    	(function (exports) {
    		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    		    return (mod && mod.__esModule) ? mod : { "default": mod };
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
    		const RUTimeUnitWithinFormatParser_1 = __importDefault(requireRUTimeUnitWithinFormatParser());
    		const RUMonthNameLittleEndianParser_1 = __importDefault(RUMonthNameLittleEndianParser$1);
    		const RUMonthNameParser_1 = __importDefault(RUMonthNameParser$1);
    		const RUTimeExpressionParser_1 = __importDefault(requireRUTimeExpressionParser());
    		const RUTimeUnitAgoFormatParser_1 = __importDefault(requireRUTimeUnitAgoFormatParser());
    		const RUMergeDateRangeRefiner_1 = __importDefault(RUMergeDateRangeRefiner$1);
    		const RUMergeDateTimeRefiner_1 = __importDefault(requireRUMergeDateTimeRefiner());
    		const configurations_1 = requireConfigurations();
    		const RUCasualDateParser_1 = __importDefault(requireRUCasualDateParser());
    		const RUCasualTimeParser_1 = __importDefault(requireRUCasualTimeParser());
    		const RUWeekdayParser_1 = __importDefault(requireRUWeekdayParser());
    		const RURelativeDateFormatParser_1 = __importDefault(requireRURelativeDateFormatParser());
    		const chrono_1 = requireChrono();
    		const SlashDateFormatParser_1 = __importDefault(SlashDateFormatParser$1);
    		const RUTimeUnitCasualRelativeFormatParser_1 = __importDefault(requireRUTimeUnitCasualRelativeFormatParser());
    		exports.casual = new chrono_1.Chrono(createCasualConfiguration());
    		exports.strict = new chrono_1.Chrono(createConfiguration(true));
    		function parse(text, ref, option) {
    		    return exports.casual.parse(text, ref, option);
    		}
    		exports.parse = parse;
    		function parseDate(text, ref, option) {
    		    return exports.casual.parseDate(text, ref, option);
    		}
    		exports.parseDate = parseDate;
    		function createCasualConfiguration() {
    		    const option = createConfiguration(false);
    		    option.parsers.unshift(new RUCasualDateParser_1.default());
    		    option.parsers.unshift(new RUCasualTimeParser_1.default());
    		    option.parsers.unshift(new RUMonthNameParser_1.default());
    		    option.parsers.unshift(new RURelativeDateFormatParser_1.default());
    		    option.parsers.unshift(new RUTimeUnitCasualRelativeFormatParser_1.default());
    		    return option;
    		}
    		exports.createCasualConfiguration = createCasualConfiguration;
    		function createConfiguration(strictMode = true) {
    		    return configurations_1.includeCommonConfiguration({
    		        parsers: [
    		            new SlashDateFormatParser_1.default(true),
    		            new RUTimeUnitWithinFormatParser_1.default(),
    		            new RUMonthNameLittleEndianParser_1.default(),
    		            new RUWeekdayParser_1.default(),
    		            new RUTimeExpressionParser_1.default(strictMode),
    		            new RUTimeUnitAgoFormatParser_1.default(),
    		        ],
    		        refiners: [new RUMergeDateTimeRefiner_1.default(), new RUMergeDateRangeRefiner_1.default()],
    		    }, strictMode);
    		}
    		exports.createConfiguration = createConfiguration;
    		
    } (ru));
    	return ru;
    }

    var es = {};

    var ESWeekdayParser = {};

    var constants = {};

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
    	const pattern_1 = pattern;
    	exports.WEEKDAY_DICTIONARY = {
    	    "domingo": 0,
    	    "dom": 0,
    	    "lunes": 1,
    	    "lun": 1,
    	    "martes": 2,
    	    "mar": 2,
    	    "miércoles": 3,
    	    "miercoles": 3,
    	    "mié": 3,
    	    "mie": 3,
    	    "jueves": 4,
    	    "jue": 4,
    	    "viernes": 5,
    	    "vie": 5,
    	    "sábado": 6,
    	    "sabado": 6,
    	    "sáb": 6,
    	    "sab": 6,
    	};
    	exports.MONTH_DICTIONARY = {
    	    "enero": 1,
    	    "ene": 1,
    	    "ene.": 1,
    	    "febrero": 2,
    	    "feb": 2,
    	    "feb.": 2,
    	    "marzo": 3,
    	    "mar": 3,
    	    "mar.": 3,
    	    "abril": 4,
    	    "abr": 4,
    	    "abr.": 4,
    	    "mayo": 5,
    	    "may": 5,
    	    "may.": 5,
    	    "junio": 6,
    	    "jun": 6,
    	    "jun.": 6,
    	    "julio": 7,
    	    "jul": 7,
    	    "jul.": 7,
    	    "agosto": 8,
    	    "ago": 8,
    	    "ago.": 8,
    	    "septiembre": 9,
    	    "setiembre": 9,
    	    "sep": 9,
    	    "sep.": 9,
    	    "octubre": 10,
    	    "oct": 10,
    	    "oct.": 10,
    	    "noviembre": 11,
    	    "nov": 11,
    	    "nov.": 11,
    	    "diciembre": 12,
    	    "dic": 12,
    	    "dic.": 12,
    	};
    	exports.INTEGER_WORD_DICTIONARY = {
    	    "uno": 1,
    	    "dos": 2,
    	    "tres": 3,
    	    "cuatro": 4,
    	    "cinco": 5,
    	    "seis": 6,
    	    "siete": 7,
    	    "ocho": 8,
    	    "nueve": 9,
    	    "diez": 10,
    	    "once": 11,
    	    "doce": 12,
    	    "trece": 13,
    	};
    	exports.TIME_UNIT_DICTIONARY = {
    	    "sec": "second",
    	    "segundo": "second",
    	    "segundos": "second",
    	    "min": "minute",
    	    "mins": "minute",
    	    "minuto": "minute",
    	    "minutos": "minute",
    	    "h": "hour",
    	    "hr": "hour",
    	    "hrs": "hour",
    	    "hora": "hour",
    	    "horas": "hour",
    	    "día": "d",
    	    "días": "d",
    	    "semana": "week",
    	    "semanas": "week",
    	    "mes": "month",
    	    "meses": "month",
    	    "cuarto": "quarter",
    	    "cuartos": "quarter",
    	    "año": "year",
    	    "años": "year",
    	};
    	exports.NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|un?|uno?|una?|algunos?|unos?|demi-?)`;
    	function parseNumberPattern(match) {
    	    const num = match.toLowerCase();
    	    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
    	        return exports.INTEGER_WORD_DICTIONARY[num];
    	    }
    	    else if (num === "un" || num === "una" || num === "uno") {
    	        return 1;
    	    }
    	    else if (num.match(/algunos?/)) {
    	        return 3;
    	    }
    	    else if (num.match(/unos?/)) {
    	        return 3;
    	    }
    	    else if (num.match(/media?/)) {
    	        return 0.5;
    	    }
    	    return parseFloat(num);
    	}
    	exports.parseNumberPattern = parseNumberPattern;
    	exports.YEAR_PATTERN = "[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?";
    	function parseYear(match) {
    	    if (match.match(/^[0-9]{1,4}$/)) {
    	        let yearNumber = parseInt(match);
    	        if (yearNumber < 100) {
    	            if (yearNumber > 50) {
    	                yearNumber = yearNumber + 1900;
    	            }
    	            else {
    	                yearNumber = yearNumber + 2000;
    	            }
    	        }
    	        return yearNumber;
    	    }
    	    if (match.match(/a\.?\s*c\.?/i)) {
    	        match = match.replace(/a\.?\s*c\.?/i, "");
    	        return -parseInt(match);
    	    }
    	    return parseInt(match);
    	}
    	exports.parseYear = parseYear;
    	const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
    	const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
    	exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
    	function parseTimeUnits(timeunitText) {
    	    const fragments = {};
    	    let remainingText = timeunitText;
    	    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    while (match) {
    	        collectDateTimeFragment(fragments, match);
    	        remainingText = remainingText.substring(match[0].length);
    	        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    	    }
    	    return fragments;
    	}
    	exports.parseTimeUnits = parseTimeUnits;
    	function collectDateTimeFragment(fragments, match) {
    	    const num = parseNumberPattern(match[1]);
    	    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    	    fragments[unit] = num;
    	}
    	
    } (constants));

    var hasRequiredESWeekdayParser;

    function requireESWeekdayParser () {
    	if (hasRequiredESWeekdayParser) return ESWeekdayParser;
    	hasRequiredESWeekdayParser = 1;
    	Object.defineProperty(ESWeekdayParser, "__esModule", { value: true });
    	const constants_1 = constants;
    	const pattern_1 = pattern;
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const weekdays_1 = requireWeekdays();
    	const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    	    "(?:(este|esta|pasado|pr[oó]ximo)\\s*)?" +
    	    `(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})` +
    	    "(?:\\s*(?:\\,|\\)|\\）))?" +
    	    "(?:\\s*(este|esta|pasado|pr[óo]ximo)\\s*semana)?" +
    	    "(?=\\W|\\d|$)", "i");
    	const PREFIX_GROUP = 1;
    	const WEEKDAY_GROUP = 2;
    	const POSTFIX_GROUP = 3;
    	let ESWeekdayParser$1 = class ESWeekdayParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return PATTERN;
    	    }
    	    innerExtract(context, match) {
    	        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
    	        const weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
    	        if (weekday === undefined) {
    	            return null;
    	        }
    	        const prefix = match[PREFIX_GROUP];
    	        const postfix = match[POSTFIX_GROUP];
    	        let norm = prefix || postfix || "";
    	        norm = norm.toLowerCase();
    	        let modifier = null;
    	        if (norm == "pasado") {
    	            modifier = "this";
    	        }
    	        else if (norm == "próximo" || norm == "proximo") {
    	            modifier = "next";
    	        }
    	        else if (norm == "este") {
    	            modifier = "this";
    	        }
    	        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
    	    }
    	};
    	ESWeekdayParser.default = ESWeekdayParser$1;
    	
    	return ESWeekdayParser;
    }

    var ESTimeExpressionParser = {};

    var hasRequiredESTimeExpressionParser;

    function requireESTimeExpressionParser () {
    	if (hasRequiredESTimeExpressionParser) return ESTimeExpressionParser;
    	hasRequiredESTimeExpressionParser = 1;
    	Object.defineProperty(ESTimeExpressionParser, "__esModule", { value: true });
    	const AbstractTimeExpressionParser_1 = requireAbstractTimeExpressionParser();
    	let ESTimeExpressionParser$1 = class ESTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    	    primaryPrefix() {
    	        return "(?:(?:aslas|deslas|las?|al?|de|del)\\s*)?";
    	    }
    	    followingPhase() {
    	        return "\\s*(?:\\-|\\–|\\~|\\〜|a(?:l)?|\\?)\\s*";
    	    }
    	};
    	ESTimeExpressionParser.default = ESTimeExpressionParser$1;
    	
    	return ESTimeExpressionParser;
    }

    var ESMergeDateTimeRefiner = {};

    var hasRequiredESMergeDateTimeRefiner;

    function requireESMergeDateTimeRefiner () {
    	if (hasRequiredESMergeDateTimeRefiner) return ESMergeDateTimeRefiner;
    	hasRequiredESMergeDateTimeRefiner = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(ESMergeDateTimeRefiner, "__esModule", { value: true });
    	const AbstractMergeDateTimeRefiner_1 = __importDefault(requireAbstractMergeDateTimeRefiner());
    	let ESMergeDateTimeRefiner$1 = class ESMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    	    patternBetween() {
    	        return new RegExp("^\\s*(?:,|de|aslas|a)?\\s*$");
    	    }
    	};
    	ESMergeDateTimeRefiner.default = ESMergeDateTimeRefiner$1;
    	
    	return ESMergeDateTimeRefiner;
    }

    var ESMergeDateRangeRefiner$1 = {};

    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(ESMergeDateRangeRefiner$1, "__esModule", { value: true });
    const AbstractMergeDateRangeRefiner_1 = __importDefault(AbstractMergeDateRangeRefiner$1);
    class ESMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1.default {
        patternBetween() {
            return /^\s*(?:-)\s*$/i;
        }
    }
    ESMergeDateRangeRefiner$1.default = ESMergeDateRangeRefiner;

    var ESMonthNameLittleEndianParser$1 = {};

    Object.defineProperty(ESMonthNameLittleEndianParser$1, "__esModule", { value: true });
    const years_1 = years;
    const constants_1 = constants;
    const constants_2 = constants;
    const pattern_1 = pattern;
    const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    const PATTERN = new RegExp(`([0-9]{1,2})(?:º|ª|°)?` +
        "(?:\\s*(?:desde|de|\\-|\\–|ao?|\\s)\\s*([0-9]{1,2})(?:º|ª|°)?)?\\s*(?:de)?\\s*" +
        `(?:-|/|\\s*(?:de|,)?\\s*)` +
        `(${pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY)})` +
        `(?:\\s*(?:de|,)?\\s*(${constants_2.YEAR_PATTERN}))?` +
        `(?=\\W|$)`, "i");
    const DATE_GROUP = 1;
    const DATE_TO_GROUP = 2;
    const MONTH_NAME_GROUP = 3;
    const YEAR_GROUP = 4;
    class ESMonthNameLittleEndianParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
        innerPattern() {
            return PATTERN;
        }
        innerExtract(context, match) {
            const result = context.createParsingResult(match.index, match[0]);
            const month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
            const day = parseInt(match[DATE_GROUP]);
            if (day > 31) {
                match.index = match.index + match[DATE_GROUP].length;
                return null;
            }
            result.start.assign("month", month);
            result.start.assign("day", day);
            if (match[YEAR_GROUP]) {
                const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
                result.start.assign("year", yearNumber);
            }
            else {
                const year = years_1.findYearClosestToRef(context.refDate, day, month);
                result.start.imply("year", year);
            }
            if (match[DATE_TO_GROUP]) {
                const endDate = parseInt(match[DATE_TO_GROUP]);
                result.end = result.start.clone();
                result.end.assign("day", endDate);
            }
            return result;
        }
    }
    ESMonthNameLittleEndianParser$1.default = ESMonthNameLittleEndianParser;

    var ESCasualDateParser = {};

    var hasRequiredESCasualDateParser;

    function requireESCasualDateParser () {
    	if (hasRequiredESCasualDateParser) return ESCasualDateParser;
    	hasRequiredESCasualDateParser = 1;
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	Object.defineProperty(ESCasualDateParser, "__esModule", { value: true });
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const references = __importStar(requireCasualReferences());
    	let ESCasualDateParser$1 = class ESCasualDateParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern(context) {
    	        return /(ahora|hoy|mañana|ayer)(?=\W|$)/i;
    	    }
    	    innerExtract(context, match) {
    	        const lowerText = match[0].toLowerCase();
    	        const component = context.createParsingComponents();
    	        switch (lowerText) {
    	            case "ahora":
    	                return references.now(context.reference);
    	            case "hoy":
    	                return references.today(context.reference);
    	            case "mañana":
    	                return references.tomorrow(context.reference);
    	            case "ayer":
    	                return references.yesterday(context.reference);
    	        }
    	        return component;
    	    }
    	};
    	ESCasualDateParser.default = ESCasualDateParser$1;
    	
    	return ESCasualDateParser;
    }

    var ESCasualTimeParser = {};

    var hasRequiredESCasualTimeParser;

    function requireESCasualTimeParser () {
    	if (hasRequiredESCasualTimeParser) return ESCasualTimeParser;
    	hasRequiredESCasualTimeParser = 1;
    	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    	    return (mod && mod.__esModule) ? mod : { "default": mod };
    	};
    	Object.defineProperty(ESCasualTimeParser, "__esModule", { value: true });
    	const index_1 = requireDist();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	const dayjs_1 = requireDayjs();
    	const dayjs_2 = __importDefault(dayjs_minExports);
    	let ESCasualTimeParser$1 = class ESCasualTimeParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return /(?:esta\s*)?(mañana|tarde|medianoche|mediodia|mediodía|noche)(?=\W|$)/i;
    	    }
    	    innerExtract(context, match) {
    	        const targetDate = dayjs_2.default(context.refDate);
    	        const component = context.createParsingComponents();
    	        switch (match[1].toLowerCase()) {
    	            case "tarde":
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                component.imply("hour", 15);
    	                break;
    	            case "noche":
    	                component.imply("meridiem", index_1.Meridiem.PM);
    	                component.imply("hour", 22);
    	                break;
    	            case "mañana":
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                component.imply("hour", 6);
    	                break;
    	            case "medianoche":
    	                dayjs_1.assignTheNextDay(component, targetDate);
    	                component.imply("hour", 0);
    	                component.imply("minute", 0);
    	                component.imply("second", 0);
    	                break;
    	            case "mediodia":
    	            case "mediodía":
    	                component.imply("meridiem", index_1.Meridiem.AM);
    	                component.imply("hour", 12);
    	                break;
    	        }
    	        return component;
    	    }
    	};
    	ESCasualTimeParser.default = ESCasualTimeParser$1;
    	
    	return ESCasualTimeParser;
    }

    var ESTimeUnitWithinFormatParser = {};

    var hasRequiredESTimeUnitWithinFormatParser;

    function requireESTimeUnitWithinFormatParser () {
    	if (hasRequiredESTimeUnitWithinFormatParser) return ESTimeUnitWithinFormatParser;
    	hasRequiredESTimeUnitWithinFormatParser = 1;
    	Object.defineProperty(ESTimeUnitWithinFormatParser, "__esModule", { value: true });
    	const constants_1 = constants;
    	const results_1 = requireResults();
    	const AbstractParserWithWordBoundary_1 = AbstractParserWithWordBoundary;
    	let ESTimeUnitWithinFormatParser$1 = class ESTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
    	    innerPattern() {
    	        return new RegExp(`(?:en|por|durante|de|dentro de)\\s*(${constants_1.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    	    }
    	    innerExtract(context, match) {
    	        const timeUnits = constants_1.parseTimeUnits(match[1]);
    	        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    	    }
    	};
    	ESTimeUnitWithinFormatParser.default = ESTimeUnitWithinFormatParser$1;
    	
    	return ESTimeUnitWithinFormatParser;
    }

    var hasRequiredEs;

    function requireEs () {
    	if (hasRequiredEs) return es;
    	hasRequiredEs = 1;
    	(function (exports) {
    		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    		    return (mod && mod.__esModule) ? mod : { "default": mod };
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
    		const configurations_1 = requireConfigurations();
    		const chrono_1 = requireChrono();
    		const SlashDateFormatParser_1 = __importDefault(SlashDateFormatParser$1);
    		const ESWeekdayParser_1 = __importDefault(requireESWeekdayParser());
    		const ESTimeExpressionParser_1 = __importDefault(requireESTimeExpressionParser());
    		const ESMergeDateTimeRefiner_1 = __importDefault(requireESMergeDateTimeRefiner());
    		const ESMergeDateRangeRefiner_1 = __importDefault(ESMergeDateRangeRefiner$1);
    		const ESMonthNameLittleEndianParser_1 = __importDefault(ESMonthNameLittleEndianParser$1);
    		const ESCasualDateParser_1 = __importDefault(requireESCasualDateParser());
    		const ESCasualTimeParser_1 = __importDefault(requireESCasualTimeParser());
    		const ESTimeUnitWithinFormatParser_1 = __importDefault(requireESTimeUnitWithinFormatParser());
    		exports.casual = new chrono_1.Chrono(createCasualConfiguration());
    		exports.strict = new chrono_1.Chrono(createConfiguration(true));
    		function parse(text, ref, option) {
    		    return exports.casual.parse(text, ref, option);
    		}
    		exports.parse = parse;
    		function parseDate(text, ref, option) {
    		    return exports.casual.parseDate(text, ref, option);
    		}
    		exports.parseDate = parseDate;
    		function createCasualConfiguration(littleEndian = true) {
    		    const option = createConfiguration(false, littleEndian);
    		    option.parsers.push(new ESCasualDateParser_1.default());
    		    option.parsers.push(new ESCasualTimeParser_1.default());
    		    return option;
    		}
    		exports.createCasualConfiguration = createCasualConfiguration;
    		function createConfiguration(strictMode = true, littleEndian = true) {
    		    return configurations_1.includeCommonConfiguration({
    		        parsers: [
    		            new SlashDateFormatParser_1.default(littleEndian),
    		            new ESWeekdayParser_1.default(),
    		            new ESTimeExpressionParser_1.default(),
    		            new ESMonthNameLittleEndianParser_1.default(),
    		            new ESTimeUnitWithinFormatParser_1.default(),
    		        ],
    		        refiners: [new ESMergeDateTimeRefiner_1.default(), new ESMergeDateRangeRefiner_1.default()],
    		    }, strictMode);
    		}
    		exports.createConfiguration = createConfiguration;
    		
    } (es));
    	return es;
    }

    var hasRequiredDist;

    function requireDist () {
    	if (hasRequiredDist) return dist;
    	hasRequiredDist = 1;
    	(function (exports) {
    		var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    		    if (k2 === undefined) k2 = k;
    		    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    		}) : (function(o, m, k, k2) {
    		    if (k2 === undefined) k2 = k;
    		    o[k2] = m[k];
    		}));
    		var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    		    Object.defineProperty(o, "default", { enumerable: true, value: v });
    		}) : function(o, v) {
    		    o["default"] = v;
    		});
    		var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    		    if (mod && mod.__esModule) return mod;
    		    var result = {};
    		    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    		    __setModuleDefault(result, mod);
    		    return result;
    		};
    		Object.defineProperty(exports, "__esModule", { value: true });
    		exports.parseDate = exports.parse = exports.casual = exports.strict = exports.es = exports.ru = exports.zh = exports.nl = exports.pt = exports.ja = exports.fr = exports.de = exports.Weekday = exports.Meridiem = exports.Chrono = exports.en = void 0;
    		const en = __importStar(requireEn());
    		exports.en = en;
    		const chrono_1 = requireChrono();
    		Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
    		(function (Meridiem) {
    		    Meridiem[Meridiem["AM"] = 0] = "AM";
    		    Meridiem[Meridiem["PM"] = 1] = "PM";
    		})(exports.Meridiem || (exports.Meridiem = {}));
    		(function (Weekday) {
    		    Weekday[Weekday["SUNDAY"] = 0] = "SUNDAY";
    		    Weekday[Weekday["MONDAY"] = 1] = "MONDAY";
    		    Weekday[Weekday["TUESDAY"] = 2] = "TUESDAY";
    		    Weekday[Weekday["WEDNESDAY"] = 3] = "WEDNESDAY";
    		    Weekday[Weekday["THURSDAY"] = 4] = "THURSDAY";
    		    Weekday[Weekday["FRIDAY"] = 5] = "FRIDAY";
    		    Weekday[Weekday["SATURDAY"] = 6] = "SATURDAY";
    		})(exports.Weekday || (exports.Weekday = {}));
    		const de = __importStar(requireDe());
    		exports.de = de;
    		const fr = __importStar(requireFr());
    		exports.fr = fr;
    		const ja = __importStar(requireJa());
    		exports.ja = ja;
    		const pt = __importStar(requirePt());
    		exports.pt = pt;
    		const nl = __importStar(requireNl());
    		exports.nl = nl;
    		const zh = __importStar(requireZh());
    		exports.zh = zh;
    		const ru = __importStar(requireRu());
    		exports.ru = ru;
    		const es = __importStar(requireEs());
    		exports.es = es;
    		exports.strict = en.strict;
    		exports.casual = en.casual;
    		function parse(text, ref, option) {
    		    return exports.casual.parse(text, ref, option);
    		}
    		exports.parse = parse;
    		function parseDate(text, ref, option) {
    		    return exports.casual.parseDate(text, ref, option);
    		}
    		exports.parseDate = parseDate;
    		
    } (dist));
    	return dist;
    }

    var distExports = requireDist();

    const shortHandDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const dayRegex = /mon|tue|wed|thu|fri|sat|sun/;
    const alldayRegex =/all day|anytime|any time|whenever/;
    const busyRegex = /except|besides|apart/;
    const beforeRegex =/before/;
    const afterRegex = /after/;
    const customChrono = distExports.casual.clone();

    let MIN_HOUR = 0;
    let MAX_HOUR = 24;

    function createEmptyCalendar() {
    	let calendar = {};
    	for (let d = 0; d < 7; d++) {
    		calendar[d] = {};
    		for (let h = MIN_HOUR; h < MAX_HOUR; h++) {
    			for (let m = 0; m < 60; m+=15) {
    				calendar[d][h+'-'+m] = [];
    			}		}	}	return calendar;
    }
    // Take a list of [{user, availableTimes}, ...] and returns a single sharedCalendar dictionary of the form {day: {'hour-min': ["user1", "user2", ...], ...}, ...}
    // the key for 9am would be '9-0', for 9:15am would be '9-15', for 9pm woul be '22-0'
    async function createSharedCalendar(userTimes) {
    	console.log({userTimes});
    	let userTimesPayload = await userTimes;
    	let sharedCalendar = createEmptyCalendar();
    	console.log({userTimesPayload});
    	userTimesPayload.forEach(obj => {
    		if (obj) {
    			let user = obj['name'];
    			let availableTimes = obj['times'];
    			if (availableTimes) {
    				for (const [day, availableBlocks] of Object.entries(availableTimes)) {
    			  availableBlocks.forEach(block => {
    			  	let startHour = (new Date(block[0])).getHours();
    			  	let endHour = (new Date(block[1])).getHours();

    			  	for (let h = startHour; h <= endHour; h++) {

    			  		let startMin = (h != startHour) ? 0 : (new Date(block[0])).getMinutes();
    			  		let endMin = (h != endHour) ? 60 : (new Date(block[1])).getMinutes();

    			  		for (let m = startMin; m < endMin; m+=15) {
    			  			sharedCalendar[day][h+'-'+m].push(user);
    			  		}			  	}
    			  });
    			}			}		}	});

    	console.log({sharedCalendar});
    	return sharedCalendar;
    }
    // Set equality from https://stackoverflow.com/questions/31128855/comparing-ecma6-sets-for-equality
    const eqSet = (xs, ys) =>
    xs.size === ys.size &&
    [...xs].every((x) => ys.has(x));

    function isSuperset(set, subset) {
      for (const elem of subset) {
        if (!set.has(elem)) {
          return false;
        }
      }
      return true;
    }
    // Concepts incorporated: Rendering Times
    // Take userTimes and returns a sorted list of the top N shared available time windows at least minMeetingLengthMin long
    async function getTopNIntervals(userTimesPromise, N) {
    	let userTimes = await userTimesPromise;
    	console.log({userTimes});
    	let sharedCalendar = await createSharedCalendar(userTimes);
    	console.log({sharedCalendar});
    	let sharedIntervals = [];
    	let ongoingIntervals = new Set();

    	for (let d = 0; d < 7; d++) {
    		for (let h = MIN_HOUR; h <= MAX_HOUR; h++) {
    			for (let m = 0; m < 60; m+=15) {
    				let cal = await sharedCalendar[d][h+'-'+m];
    				// console.log({cal})
    				let userSet = new Set(cal);

    				// Test if interval is keeping track of a new set of users not already being covered
    				let newUserSet = userSet.size >= 1;
    				if (newUserSet) {
    					ongoingIntervals.forEach(i => {
    						if (eqSet(sharedIntervals[i]['users'], userSet)) {
    							newUserSet = false;
    						}					});
    				}
    				// If this is a new set of users not being covered, create an interval
    				if (newUserSet) {
    					ongoingIntervals.add(sharedIntervals.length);	
    					sharedIntervals.push({users: userSet, start: [d, h, m], end: []});
    				}
    				ongoingIntervals.forEach(i => {
    					if (!isSuperset(userSet, sharedIntervals[i].users)) {
    						sharedIntervals[i]['end'] = [d, h, m];
    						ongoingIntervals.delete(i);
    					}				});
    			}		}	}

    	sharedIntervals.sort((a, b) => { 
    	    let numUserDiff = b['users'].size - a['users'].size;
    	    if (numUserDiff != 0) {
    	    	return numUserDiff;
    	    }
    	    else if (a['start']['d'] - b['start']['d'] != 0) {
    	    	return a['start']['d'] - b['start']['d'];
    	    }
    	    else if (a['start']['h'] - b['start']['h'] != 0) {
    	    	return a['start']['h'] - b['start']['h'];
    	    }
    	    else {
    	    	return a['start']['m'] - b['start']['m'];
    	    }	});

    	return sharedIntervals.slice(0, N);
    }
    // Refine parser for larger hour before smaller hour
    // E.g. 11-2pm = 11am-2pm
    // #TODO: handle no am/pm, e.g. 2-3 = 2-3pm OR somehow alert user that am/pm was left off?
    customChrono.refiners.push({
        refine: (context, results) => {
            results.forEach((result) => {
            	if ('start' in result && 'end' in result && result.end != null && result.start.get('hour') > result.end.get('hour')) {
                	result.start.assign('meridiem', 0);
                	result.start.assign('hour', result.start.get('hour') % 12);
                	result.end.assign('meridiem', 1);
                	result.end.assign('hour', result.end.get('hour') % 12 + 12);
                }        });
            return results;
        }
    });

    // TODO: add support for time zone! (by leaving it in datetime object)
    // Concepts incorporated: Text Time Description
    // Takes text and processes it into a dictionary of available times for each day of the week: {0: [[sun-datetimestart1, sun-datetimeend1], [sun-datetimestart2, sun-datetimeend2]], 1: [], ... 6: []}
    function processText(text) {
    	text = text.toLowerCase();
    	text = text.replace(';', ':');
    	shortHandDays.forEach((day) => {
    		text = text.replace(day, '\n' + day);
    	});
    	
    	// Split lines
    	let lines = text.split('\n');

    	// Set empty available times
    	let availableTimes = {};
    	for (let i = 0; i < 7; i++) {
    		availableTimes[i] = [];
    	}

    	for (let i = 0; i < lines.length; i++) {
    		let line = lines[i];
    		console.log(lines[i]);
    		let parsed = null;

    		// If a full day is mentioned
    		// e.g. Monday all day
    		if (alldayRegex.test(line) && !busyRegex.test(line)  && !beforeRegex.test(line) && !afterRegex.test(line)) {
    			parsed = distExports.parse(line, undefined, { forwardDate: true });
    			if (parsed.length > 0) {
    				let date = parsed[0].start.date();
    				availableTimes[parsed[0].start.get('weekday')] = [[new Date(date.getYear(), date.getMonth(), date.getDay(), MIN_HOUR), new Date(date.getYear(), date.getMonth(), date.getDay(), MAX_HOUR)]];
    			}		}
    		
    		// Handle single or multiple times for day
    		// e.g. Monday 8-9am, 1-2pm, 3-4pm
    			// Handle 'before' or 'after'
    		else {

    			// Now, parse text with custom parser
    			// forwardDate (sets to only dates in the future) not working! no biggie for now because we are relying on day of week (0,1,2,3,4,5,6) for rendering, not dates (2/27 vs 3/6)
    			parsed = customChrono.parse(line, undefined, { forwardDate: true });
    			for (let i = 0; i < parsed.length; i++) {
    				if (!dayRegex.test(parsed[i]) && i > 0) {
    					parsed[i].start.assign('day', parsed[i-1].start.get('day'));
    					parsed[i].start.assign('month', parsed[i-1].start.get('month'));

    					if ('end' in parsed[i] && parsed[i].end != null) {
    						parsed[i].end.assign('day', parsed[i-1].start.get('day'));
    						parsed[i].end.assign('month', parsed[i-1].start.get('month'));
    					}
    				}
    				// There is currently a bug in the parser (not the before/after code below), 
    				// that doesn't parse the '4-5pm' in "monday before 11am, from 2-3pm, 4-5pm" correctly
    				console.log(parsed);
    				// need to check for before/after in the substring between the current parsed item and the previous parsed item.
    				if (beforeRegex.test(parsed[i]) || 
    						(i > 0 && beforeRegex.test(line.substring(parsed[i-1].index, line.substring(parsed[i].index))))) {
    					parsed[i].end = parsed[i].start.clone();
    					console.log();
    					parsed[i].end.assign('hour', parsed[i].start.get('hour'));
    					parsed[i].end.assign('minute', parsed[i].start.get('minute'));
    					parsed[i].start.assign('hour', MIN_HOUR);
    					parsed[i].start.assign('minute', 0);
    				}
    				else if (afterRegex.test(line) || 
    						(i > 0 && afterRegex.test(line.substring(parsed[i-1].index, line.substring(parsed[i].index))))) {
    					parsed[i].end = parsed[i].start.clone();
    					parsed[i].end.assign('hour', MAX_HOUR);
    					parsed[i].end.assign('minute', 0);
    				}

    				if ('start' in parsed[i] && 'end' in parsed[i] && parsed[i].end != null) {
    					availableTimes[parsed[i].start.date().getDay()].push([parsed[i].start.date(), parsed[i].end.date()]);
    				}			}
    		}
    		// If they are free except for the times listed, invert the time blocks for that day
    		// e.g. Monday except 2-3pm

    		if (busyRegex.test(line)) {
    			let weekday = parsed[0].start.date().getDay();

    			let date = parsed[0].start.date();
    			let startHourDate = new Date(date.getYear(), date.getMonth(), date.getDay(), MIN_HOUR);
    			let endHourDate;
    			for (let i = 0; i < availableTimes[weekday].length; i++) {
    				endHourDate = availableTimes[weekday][i][0];
    				availableTimes[weekday][i][0] = startHourDate;
    				startHourDate = availableTimes[weekday][i][1];
    				availableTimes[weekday][i][1] = endHourDate;
    			}
    			endHourDate = new Date(date.getYear(), date.getMonth(), date.getDay(), MAX_HOUR);
    			availableTimes[weekday].push([startHourDate, endHourDate]);
    		}	}	console.log(availableTimes);
    	return availableTimes;
    }
    // Concepts incorporated: Rendering Times
    function makeTimeArr(timeMap){
    	console.log('in time array');
    	let timeArr = Array(24).fill(0).map(() => Array(7).fill(0));
    	for (let i = 0; i<7; i++) {
    		for(let j = 0; j<24; j++) {
    			console.log(`timeMap ${timeMap[i]}`);
    			for (let k = 0; k < timeMap[i].length; k++){
    				// console.log(`time Arr[i][k]: ${timeArr[i]}`);
    				console.log(timeMap[i][k][0].getHours());
    				if (timeMap[i][k][0].getHours() <= j && timeMap[i][k][1].getHours() >= j){
    					timeArr[j][i] = true;
    				}
    			}
    		}
    		
    	}
    	return timeArr
    }

    /* src/components/VoiceRecognition.svelte generated by Svelte v3.55.1 */

    function create_fragment$7(ctx) {
    	let recorder;
    	let current;
    	recorder = new Recorder({ $$inline: true });
    	recorder.$on("recorderHandler", /*recorderHandler*/ ctx[0]);

    	const block = {
    		c: function create() {
    			create_component(recorder.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(recorder, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(recorder.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(recorder.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(recorder, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function readOutLoud(message) {
    	let speech = new SpeechSynthesisUtterance();
    	speech.text = message;
    	speech.volume = 1;
    	speech.rate = 1;
    	speech.pitch = 1;
    	window.speechSynthesis.speak(speech);
    }

    // function saveHandler() {
    //   recognition.stop();
    //   if (!noteContent.length) {
    //     recordingText =
    //       "Could not save empty note. Please add a message to your note.";
    //   } else {
    //     saveTime(new Date().toLocaleString(), noteContent);
    //     noteContent = "";
    //     times = getAllTimes();
    //     recordingText = "Note saved successfully.";
    //     window.setTimeout(() => {
    //       recordingText = `Press the Play button to Start recording.`;
    //   }, 5000);
    //   }
    // }
    function readOutLoudHandler(event) {
    	let data = event.detail.content;
    	readOutLoud(data);
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VoiceRecognition', slots, []);
    	let { noteContent = "" } = $$props;
    	let recordingText = `Press the Play button to Start recording.`;
    	let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    	let recognition = new SpeechRecognition();

    	/** Voice API Logic Start**/
    	recognition.continuous = true;

    	recognition.onresult = function (event) {
    		let current = event.resultIndex;
    		let transcript = event.results[current][0].transcript;
    		$$invalidate(1, noteContent += transcript);
    	};

    	recognition.onstart = function () {
    		recordingText = "Voice recognition Started. Try speaking into the microphone.";
    	};

    	recognition.onspeechend = function () {
    		recordingText = "Voice recognition turned off.";
    	};

    	recognition.onerror = function (event) {
    		if (event.error == "no-speech") {
    			recordingText = "No Voice was detected. Try again.";
    		}
    	};

    	/** Component Handlers**/
    	function recorderHandler(event) {
    		let type = event.detail.actionType;

    		if (type === "PLAY") {
    			startHandler();
    		} else if (type === "PAUSE") {
    			pauseHandler();
    		} else if (type === "RESET") {
    			resetHandler();
    		} else ;
    	}

    	function startHandler() {
    		if (noteContent.length) {
    			$$invalidate(1, noteContent += " ");
    		}

    		recognition.start();
    	}

    	function pauseHandler() {
    		recognition.stop();
    		recordingText = "Voice recognition paused.";
    	}

    	function resetHandler() {
    		$$invalidate(1, noteContent = "");
    		recordingText = "Note reset successfully.";

    		window.setTimeout(
    			() => {
    				recordingText = `Press the Play button to Start recording.`;
    			},
    			5000
    		);
    	}

    	const writable_props = ['noteContent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VoiceRecognition> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('noteContent' in $$props) $$invalidate(1, noteContent = $$props.noteContent);
    	};

    	$$self.$capture_state = () => ({
    		Recorder,
    		processText,
    		noteContent,
    		recordingText,
    		SpeechRecognition,
    		recognition,
    		readOutLoud,
    		recorderHandler,
    		startHandler,
    		pauseHandler,
    		resetHandler,
    		readOutLoudHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ('noteContent' in $$props) $$invalidate(1, noteContent = $$props.noteContent);
    		if ('recordingText' in $$props) recordingText = $$props.recordingText;
    		if ('SpeechRecognition' in $$props) SpeechRecognition = $$props.SpeechRecognition;
    		if ('recognition' in $$props) recognition = $$props.recognition;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [recorderHandler, noteContent];
    }

    class VoiceRecognition extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { noteContent: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VoiceRecognition",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get noteContent() {
    		throw new Error("<VoiceRecognition>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noteContent(value) {
    		throw new Error("<VoiceRecognition>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Table.svelte generated by Svelte v3.55.1 */

    const file$6 = "src/components/Table.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (33:9) {#each dayArr as day}
    function create_each_block_2(ctx) {
    	let th;
    	let t_value = /*day*/ ctx[6] + "";
    	let t;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			attr_dev(th, "class", "svelte-13ilgsv");
    			add_location(th, file$6, 33, 9, 660);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(33:9) {#each dayArr as day}",
    		ctx
    	});

    	return block;
    }

    // (39:9) {#each hour as day, j}
    function create_each_block_1(ctx) {
    	let td;

    	const block = {
    		c: function create() {
    			td = element("td");
    			attr_dev(td, "class", "svelte-13ilgsv");
    			toggle_class(td, "available", /*day*/ ctx[6]);
    			add_location(td, file$6, 40, 9, 858);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*timeArr*/ 1) {
    				toggle_class(td, "available", /*day*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(39:9) {#each hour as day, j}",
    		ctx
    	});

    	return block;
    }

    // (37:9) {#each timeArr as hour, i}
    function create_each_block$1(ctx) {
    	let tr;
    	let t;
    	let each_value_1 = /*hour*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			add_location(tr, file$6, 37, 5, 748);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*timeArr*/ 1) {
    				each_value_1 = /*hour*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(37:9) {#each timeArr as hour, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let table;
    	let tr;
    	let t;
    	let each_value_2 = /*dayArr*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = /*timeArr*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tr, file$6, 31, 5, 615);
    			attr_dev(table, "class", "svelte-13ilgsv");
    			add_location(table, file$6, 30, 1, 602);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dayArr*/ 2) {
    				each_value_2 = /*dayArr*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*timeArr*/ 1) {
    				each_value = /*timeArr*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, []);
    	let { timeArr } = $$props;
    	const dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    	function modifyAvail(i, j) {
    		$$invalidate(0, timeArr[i][j] = !timeArr[i][j], timeArr);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (timeArr === undefined && !('timeArr' in $$props || $$self.$$.bound[$$self.$$.props['timeArr']])) {
    			console.warn("<Table> was created without expected prop 'timeArr'");
    		}
    	});

    	const writable_props = ['timeArr'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('timeArr' in $$props) $$invalidate(0, timeArr = $$props.timeArr);
    	};

    	$$self.$capture_state = () => ({ timeArr, dayArr, modifyAvail });

    	$$self.$inject_state = $$props => {
    		if ('timeArr' in $$props) $$invalidate(0, timeArr = $$props.timeArr);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [timeArr, dayArr];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { timeArr: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get timeArr() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timeArr(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // concept: log in by name
    let storedData = writable([]);
    let currentUser = writable("");

    var accessibleDate = function accessibleDate(date, options) {

        // Sanity check the function params
        if (!date) {
            console.error('accessible-date: You must supply a date in ISO format.');
            return '';
        }

        var settings = {
            supportedLanguages: ['en', 'es', 'fr'],
            language: '',
            military: false,
            format: '',
            ignore: ['heure', 'heures', 'minute', 'minutes', 'second', 'seconds', 'Day', 'Date', 'Hour', 'Month', 'Meridian', 'Second', 'Year']
        };

        if (!options.format || typeof options.format !== 'string') {
            console.error('accessible-date: You must supply a format.');
            return '';
        }
        settings.format = options.format;

        if (options.language) {
            var language = settings.supportedLanguages.find(function (lang) {
                return options.language === lang;
            });
            settings.language = language || 'en';
        }

        if (options.military && typeof options.military === 'boolean' && !settings.language.match(/es|fr/)) {
            settings.military = options.military;
        }

        if (options.ignore && Array.isArray(options.ignore)) {
            options.ignore.forEach(function (ignoreString) {
                settings.ignore.push(ignoreString);
            });
        }

        // Add settings object that holds the parts of the date formatted
        var dateParts = {
            // Day (DD)
            day: {
                en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                es: ['domingo', 'lunes', 'martes', 'mi\xE9rcoles', 'jueves', 'viernes', 's\xE1bado'],
                fr: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
            },
            // Minute (MM)
            minute: {
                en: {
                    standard: ['oh clock', 'oh one', 'oh two', 'oh three', 'oh four', 'oh five', 'oh six', 'oh seven', 'oh eight', 'oh nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty', 'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine', 'fourty', 'fourty-one', 'fourty-two', 'fourty-three', 'fourty-four', 'fourty-five', 'fourty-six', 'fourty-seven', 'fourty-eight', 'fourty-nine', 'fifty', 'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine'],
                    military: ['zero zero', 'zero one', 'zero two', 'zero three', 'zero four', 'zero five', 'zero six', 'zero seven', 'zero eight', 'zero nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty', 'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine', 'fourty', 'fourty-one', 'fourty-two', 'fourty-three', 'fourty-four', 'fourty-five', 'fourty-six', 'fourty-seven', 'fourty-eight', 'fourty-nine', 'fifty', 'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine']
                },
                es: {
                    standard: ['', 'y uno', 'y dos', 'y tres', 'y cuatro', 'y cinco', 'y seis', 'y siete', 'y ocho', 'y nueve', 'y diez', 'y once', 'y doce', 'y trece', 'y catorce', 'y cuarto', 'y dieceseis', 'y diecesiete', 'y dieceocho', 'y diecenueve', 'y veinte', 'y veintiuno', 'y veintid\xF3s', 'y veintitr\xE9s', 'y veinticuatro', 'y veinticinco', 'y veintis\xE9is', 'y veintisiete', 'y veintiocho', 'y veintinueve', 'y media', 'y treinta y uno', 'y treinta y dos', 'y treinta y tres', 'y treinta y cuatro', 'y treinta y cinco', 'y treinta y seis', 'y treinta y siete', 'y trienta y ocho', 'y treinta y nueve', 'y cuarenta', 'y cuarenta y uno', 'y curatenta y dos', 'y cuarenta y trece', 'y cuarenta y cuatro', 'y cuarenta y cinco', 'y cuarenta y seis', 'y cuarenta y siete', 'y cuarenta y ocho', 'y cuarenta y nueve', 'y cincuenta', 'y cincuenta y uno', 'y cincuenta y dos', 'y cincuenta y trece', 'y cincuenta y cuatro', 'y cincuenta y cinco', 'y cincuenta y seis', 'y cincuenta y siete', 'y cincuenta y ocho', 'y cincuenta y nueve']
                },
                fr: {
                    standard: ['', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt', 'vingt et un', 'vingt-deux', 'vingt-trois', 'vingt-quatre', 'vingt-cinq', 'vingt-six', 'vingt-sept', 'vingt-huit', 'vingt-neuf', 'trente', 'Trente et un', 'Trente-deux', 'Trente-trois', 'Trente-quatre', 'Trente-cinq', 'Trente-six', 'Trente-sept', 'Trente-huit', 'Trente-neuf', 'quarante', 'quarante et un', 'quarante-deux', 'quarante-trois', 'quarante-quatre', 'quarante-cinq', 'quarante-six', 'quarante-sept', 'quarante-huit', 'quarante-neuf', 'cinquante', 'cinquante et un', 'cinquante-deux', 'cinquante-trois', 'cinquante-quatre', 'cinquante-cinq', 'cinquante-six', 'cinquante-sept', 'cinquante-huit', 'cinquante-neuf']
                }
            },
            // Date (D)
            date: {
                en: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eigth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh', 'twenty-eighth', 'twenty-ninth', 'thirtieth', 'thirty-first'],
                es: ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieceseis', 'diecesiete', 'dieceocho', 'diecenueve', 'veinte', 'veintiuno', 'veintid\xF3s', 'veintitr\xE9s', 'veinticuatro', 'veinticinco', 'veintis\xE9is', 'veintisiete', 'veintiocho', 'veintinueve', 'treinta', 'treinta y uno'],
                fr: ['une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt', 'vingt et un', 'vingt-deux', 'vingt-trois', 'vingt-quatre', 'vingt-cinq', 'vingt-six', 'vingt-sept', 'vingt-huit', 'vingt-neuf', 'trente', 'Trente et un']
            },
            // Hour (H)
            hour: {
                en: {
                    standard: ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'],
                    military: ['zero zero', 'zero one', 'zero two', 'zero three', 'zero four', 'zero five', 'zero six', 'zero seven', 'zero eight', 'zero nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three']
                },
                es: {
                    standard: ['doce', 'uno', 'dos', 'trece', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'uno', 'dos', 'trece', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once']
                },
                fr: {
                    standard: ['z\xE9ro', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt', 'vingt et un', 'vingt-deux', 'vingt-trois']
                }
            },
            // Month (M)
            month: {
                en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agusto', 'spetiembre', 'octubre', 'noviembre', 'diciembre'],
                fr: ['janvier', 'f\xE9vrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'ao\xFBt', 'septembre', 'octobre', 'novembre', 'd\xE9cembre']
            },
            // Second (S)
            second: {
                en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty', 'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine', 'fourty', 'fourty-one', 'fourty-two', 'fourty-three', 'fourty-four', 'fourty-five', 'fourty-six', 'fourty-seven', 'fourty-eight', 'fourty-nine', 'fifty', 'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine'],
                es: ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieceseis', 'diecesiete', 'dieceocho', 'diecenueve', 'veinte', 'veintiuno', 'veintid\xF3s', 'veintitr\xE9s', 'veinticuatro', 'veinticinco', 'veintis\xE9is', 'veintisiete', 'veintiocho', 'veintinueve', 'treinta', 'treinta y uno', 'treinta y dos', 'treinta y tres', 'treinta y cuatro', 'treinta y cinco', 'treinta y seis', 'treinta y siete', 'trienta y ocho', 'treinta y nueve', 'cuarenta', 'cuarenta y uno', 'curatenta y dos', 'cuarenta y trece', 'cuarenta y cuatro', 'cuarenta y cinco', 'cuarenta y seis', 'cuarenta y siete', 'cuarenta y ocho', 'cuarenta y nueve', 'cincuenta', 'cincuenta y uno', 'cincuenta y dos', 'cincuenta y trece', 'cincuenta y cuatro', 'cincuenta y cinco', 'cincuenta y seis', 'cincuenta y siete', 'cincuenta y ocho', 'cincuenta y nueve'],
                fr: ['', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt', 'vingt et un', 'vingt-deux', 'vingt-trois', 'vingt-quatre', 'vingt-cinq', 'vingt-six', 'vingt-sept', 'vingt-huit', 'vingt-neuf', 'trente', 'Trente et un', 'Trente-deux', 'Trente-trois', 'Trente-quatre', 'Trente-cinq', 'Trente-six', 'Trente-sept', 'Trente-huit', 'Trente-neuf', 'quarante', 'quarante et un', 'quarante-deux', 'quarante-trois', 'quarante-quatre', 'quarante-cinq', 'quarante-six', 'quarante-sept', 'quarante-huit', 'quarante-neuf', 'cinquante', 'cinquante et un', 'cinquante-deux', 'cinquante-trois', 'cinquante-quatre', 'cinquante-cinq', 'cinquante-six', 'cinquante-sept', 'cinquante-huit', 'cinquante-neuf']
            },
            // Year (Y)
            year: {
                en: {
                    century: ['', 'one hundred', 'two hundred', 'three hundred', 'four hundred', 'five hundred', 'six hundred', 'seven hundred', 'eight hundred', 'nine hundred', 'one thousand', 'eleven hundred', 'twelve hundred', 'thirteen hundred', 'fourteen hundred', 'fifteen hundred', 'sixteen hundred', 'seventeen hundred', 'eighteen hundred', 'nineteen hundred', 'two thousand', 'twenty one'],
                    decade: ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty', 'thirty-one', 'thirty-two', 'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 'thirty-eight', 'thirty-nine', 'fourty', 'fourty-one', 'fourty-two', 'fourty-three', 'fourty-four', 'fourty-five', 'fourty-six', 'fourty-seven', 'fourty-eight', 'fourty-nine', 'fifty', 'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine', 'sixty', 'sixty-one', 'sixty-two', 'sixty-three', 'sixty-four', 'sixty-five', 'sixty-six', 'sixty-seven', 'sixty-eight', 'sixty-nine', 'seventy', 'seventy-one', 'seventy-two', 'seventy-three', 'seventy-four', 'seventy-five', 'seventy-six', 'seventy-seven', 'seventy-eight', 'seventy-nine', 'eighty', 'eighty-one', 'eighty-two', 'eighty-three', 'eighty-four', 'eighty-five', 'eighty-six', 'eighty-seven', 'eighty-eight', 'eighty-nine', 'ninety', 'ninety-one', 'ninety-two', 'ninety-three', 'ninety-four', 'ninety-five', 'ninety-six', 'ninety-seven', 'ninety-eight', 'ninety-nine']
                },
                es: {
                    century: ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos', 'mil', 'mil cien', 'mil doscientos', 'mil trescientos', 'mil cuatrocientos', 'mil quinientos', 'mil seiscientos', 'mil setecientos', 'mil ochocientos', 'mil novecientos', 'dos mil', 'dos mil cien'],
                    decade: ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieceseis', 'diecesiete', 'dieceocho', 'diecenueve', 'veinte', 'veintiuno', 'veintid\xF3s', 'veintitr\xE9s', 'veinticuatro', 'veinticinco', 'veintis\xE9is', 'veintisiete', 'veintiocho', 'veintinueve', 'treinta', 'treinta y uno', 'treinta y dos', 'treinta y tres', 'treinta y cuatro', 'treinta y cinco', 'treinta y seis', 'treinta y siete', 'trienta y ocho', 'treinta y nueve', 'cuarenta', 'cuarenta y uno', 'curatenta y dos', 'cuarenta y trece', 'cuarenta y cuatro', 'cuarenta y cinco', 'cuarenta y seis', 'cuarenta y siete', 'cuarenta y ocho', 'cuarenta y nueve', 'cincuenta', 'cincuenta y uno', 'cincuenta y dos', 'cincuenta y trece', 'cincuenta y cuatro', 'cincuenta y cinco', 'cincuenta y seis', 'cincuenta y siete', 'cincuenta y ocho', 'cincuenta y nueve', 'sesenta', 'sesenta y uno', 'sesenta y dos', 'sesenta y trece', 'sesenta y cuatro', 'sesenta y cinco', 'sesenta y seis', 'sesenta y siete', 'sesenta y ocho', 'sesenta y nueve', 'setenta', 'setenta y uno', 'setenta y dos', 'setenta y trece', 'setenta y cuatro', 'setenta y cinco', 'setenta y seis', 'setenta y siete', 'setenta y ocho', 'setenta y nueve', 'ochenta', 'ochenta y uno', 'ochenta y dos', 'ochenta y trece', 'ochenta y cuatro', 'ochenta y cinco', 'ochenta y seis', 'ochenta y siete', 'ochenta y ocho', 'ochenta y nueve', 'noventa', 'noventa y uno', 'noventa y dos', 'noventa y trece', 'noventa y cuatro', 'noventa y cinco', 'noventa y seis', 'noventa y siete', 'noventa y ocho', 'noventa y nueve']
                },
                fr: {
                    century: ['', 'cent', 'deux cents', 'trois cents', 'quatre cents', 'cinq cents', 'six cents', 'sept cents', 'huit cents', 'neuf cents', 'mille', 'mille cent', 'mille deux cents', 'mille trois cents', 'mille quatre cents', 'mille cinq cents', 'mille six cents', 'mille sept cents', 'mille huit cents', 'mille neuf cents', 'deux mille', 'deux mille cent'],
                    decade: ['', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt', 'vingt et un', 'vingt-deux', 'vingt-trois', 'vingt-quatre', 'vingt-cinq', 'vingt-six', 'vingt-sept', 'vingt-huit', 'vingt-neuf', 'trente', 'Trente et un', 'Trente-deux', 'Trente-trois', 'Trente-quatre', 'Trente-cinq', 'Trente-six', 'Trente-sept', 'Trente-huit', 'Trente-neuf', 'quarante', 'quarante et un', 'quarante-deux', 'quarante-trois', 'quarante-quatre', 'quarante-cinq', 'quarante-six', 'quarante-sept', 'quarante-huit', 'quarante-neuf', 'cinquante', 'cinquante et un', 'cinquante-deux', 'cinquante-trois', 'cinquante-quatre', 'cinquante-cinq', 'cinquante-six', 'cinquante-sept', 'cinquante-huit', 'cinquante-neuf', 'soixante', 'soixante et un', 'soixante-deux', 'soixante-trois', 'soixante-quatre', 'soixante-cinq', 'soixante-six', 'soixante-sept', 'soixante-huit', 'soixante-neuf', 'soixante-dix', 'soixante-et-onze', 'soixante-douze', 'soixante-treize', 'soixante-quatorze', 'soixante-quinze', 'soixante-seize', 'soixante-dix-sept', 'soixante-dix-huit', 'soixante-dix-neuf', 'quatre-vingts', 'quatre-vingt-un', 'quatre-vingt-deux', 'quatre-vingt-trois', 'quatre-vingt-quatre', 'quatre-vingt-cinq', 'quatre-vingt-six', 'quatre-vingt-sept', 'quatre-vingt-huit', 'quatre-vingt-neuf', 'quatre-vingt-dix', 'quatre-vingt-onze', 'quatre-vingt-douze', 'quatre-vingt-treize', 'quatre-vingt-quatorze', 'quatre-vingt-quinze', 'quatre-vingt-seize', 'quatre-vingt-dix-sept', 'quatre-vingt-dix-huit', 'quatre-vingt-dix-neuf']
                }
            },
            // Meridian (m)
            meridian: {
                en: ['a m', 'p m'],
                es: ['de la ma\xF1ana', 'de la tarde'],
                fr: ['du matin', 'du soir']
            }
        };

        // Convert the date using new Date();
        var dateToFormat = new Date(date);
        var datePartsParsed = {
            DD: dateParts.day[settings.language][dateToFormat.getUTCDay()],
            MM: settings.military ? dateParts.minute[settings.language].military[dateToFormat.getUTCMinutes()] : dateParts.minute[settings.language].standard[dateToFormat.getUTCMinutes()],
            D: dateParts.date[settings.language][dateToFormat.getUTCDate() - 1],
            H: settings.military ? dateParts.hour[settings.language].military[dateToFormat.getUTCHours()] : dateParts.hour[settings.language].standard[dateToFormat.getUTCHours()],
            M: dateParts.month[settings.language][dateToFormat.getUTCMonth()],
            S: dateParts.date[settings.language][dateToFormat.getUTCSeconds()],
            Y: function () {
                var year = '' + dateToFormat.getUTCFullYear();
                var century = dateParts.year[settings.language].century[parseInt(year.substr(0, 2))];
                var decade = dateParts.year[settings.language].decade[parseInt(year.substr(2, 3))];
                return century + ' ' + decade;
            }(),
            m: settings.military ? '' : dateToFormat.getUTCHours() >= 12 ? dateParts.meridian[settings.language][1] : dateParts.meridian[settings.language][0]
        };

        // Format the date based off of the format requested
        // The final replace is there because if a dateParsedPart doesn’t exist, then it
        // will place it in as an additional space. This removes that space.
        var datePartsParsedArray = Object.keys(datePartsParsed);
        var formatArray = settings.format.split(' ');
        return formatArray.map(function (datePart) {
            var datePartFormatted = datePart;
            for (var j = 0; j < settings.ignore.length; j++) {
                if (datePart.indexOf(settings.ignore[j]) !== -1) {
                    return datePartFormatted;
                }
            }
            for (var i = 0; i < datePartsParsedArray.length; i++) {
                if (datePart.indexOf(datePartsParsedArray[i]) !== -1) {
                    datePartFormatted = datePart.replace(datePartsParsedArray[i], datePartsParsed[datePartsParsedArray[i]]);
                    break;
                }
            }
            return datePartFormatted;
        }).join(' ').replace('  ', ' ').trim();
    };

    /* src/components/InputTimes.svelte generated by Svelte v3.55.1 */

    const { console: console_1 } = globals;
    const file$5 = "src/components/InputTimes.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>  import VoiceRecognition from './VoiceRecognition.svelte'  import {processText, makeTimeArr, getTopNIntervals}
    function create_catch_block(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>  import VoiceRecognition from './VoiceRecognition.svelte'  import {processText, makeTimeArr, getTopNIntervals}",
    		ctx
    	});

    	return block;
    }

    // (162:3) {:then topTimes}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*topTimes*/ ctx[20];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*topTimesText, dayArr*/ 12) {
    				each_value = /*topTimes*/ ctx[20];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(162:3) {:then topTimes}",
    		ctx
    	});

    	return block;
    }

    // (163:3) {#each topTimes as time}
    function create_each_block(ctx) {
    	let div;
    	let p;
    	let b;
    	let time;
    	let t0_value = /*dayArr*/ ctx[3][/*time*/ ctx[21].day] + "";
    	let t0;
    	let t1;
    	let t2_value = /*time*/ ctx[21].startTime + "";
    	let t2;
    	let t3;
    	let t4_value = /*time*/ ctx[21].endTime + "";
    	let t4;
    	let time_aria_label_value;
    	let t5;
    	let br0;
    	let t6;
    	let u;
    	let t7_value = /*time*/ ctx[21].numUsers + "";
    	let t7;
    	let t8;
    	let br1;
    	let t9;
    	let t10_value = /*time*/ ctx[21].users + "";
    	let t10;
    	let t11;
    	let t12;
    	let br2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			b = element("b");
    			time = element("time");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = text(" - ");
    			t4 = text(t4_value);
    			t5 = space();
    			br0 = element("br");
    			t6 = space();
    			u = element("u");
    			t7 = text(t7_value);
    			t8 = text(" people");
    			br1 = element("br");
    			t9 = text("\n\t\t\t\t\t(");
    			t10 = text(t10_value);
    			t11 = text(")");
    			t12 = space();
    			br2 = element("br");
    			attr_dev(time, "datetime", "");
    			attr_dev(time, "aria-label", time_aria_label_value = /*time*/ ctx[21].accessibleTime);
    			add_location(time, file$5, 164, 11, 5991);
    			add_location(b, file$5, 164, 8, 5988);
    			add_location(br0, file$5, 165, 5, 6111);
    			add_location(u, file$5, 166, 5, 6121);
    			add_location(br1, file$5, 166, 34, 6150);
    			add_location(p, file$5, 164, 5, 5985);
    			attr_dev(div, "class", "top-time svelte-n0rlhk");
    			add_location(div, file$5, 163, 4, 5955);
    			add_location(br2, file$5, 169, 4, 6194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, b);
    			append_dev(b, time);
    			append_dev(time, t0);
    			append_dev(time, t1);
    			append_dev(time, t2);
    			append_dev(time, t3);
    			append_dev(time, t4);
    			append_dev(p, t5);
    			append_dev(p, br0);
    			append_dev(p, t6);
    			append_dev(p, u);
    			append_dev(u, t7);
    			append_dev(u, t8);
    			append_dev(p, br1);
    			append_dev(div, t9);
    			append_dev(div, t10);
    			append_dev(div, t11);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, br2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*topTimesText*/ 4 && t0_value !== (t0_value = /*dayArr*/ ctx[3][/*time*/ ctx[21].day] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*topTimesText*/ 4 && t2_value !== (t2_value = /*time*/ ctx[21].startTime + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*topTimesText*/ 4 && t4_value !== (t4_value = /*time*/ ctx[21].endTime + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*topTimesText*/ 4 && time_aria_label_value !== (time_aria_label_value = /*time*/ ctx[21].accessibleTime)) {
    				attr_dev(time, "aria-label", time_aria_label_value);
    			}

    			if (dirty & /*topTimesText*/ 4 && t7_value !== (t7_value = /*time*/ ctx[21].numUsers + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*topTimesText*/ 4 && t10_value !== (t10_value = /*time*/ ctx[21].users + "")) set_data_dev(t10, t10_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(br2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(163:3) {#each topTimes as time}",
    		ctx
    	});

    	return block;
    }

    // (160:24)      <p>Processing Times...</p>    {:then topTimes}
    function create_pending_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Processing Times...";
    			add_location(p, file$5, 160, 4, 5876);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(160:24)      <p>Processing Times...</p>    {:then topTimes}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let h20;
    	let t3;
    	let div2;
    	let div0;
    	let h21;
    	let t5;
    	let label;
    	let h30;
    	let t7;
    	let input0;
    	let t8;
    	let h31;
    	let t10;
    	let p;
    	let b0;
    	let t12;
    	let b1;
    	let t14;
    	let u0;
    	let t16;
    	let i0;
    	let t18;
    	let u1;
    	let t20;
    	let i1;
    	let t22;
    	let i2;
    	let t24;
    	let u2;
    	let t26;
    	let i3;
    	let t28;
    	let t29;
    	let voicerecognition;
    	let updating_noteContent;
    	let t30;
    	let textarea;
    	let t31;
    	let br0;
    	let br1;
    	let t32;
    	let input1;
    	let t33;
    	let br2;
    	let t34;
    	let div1;
    	let h22;
    	let t36;
    	let promise;
    	let current;
    	let mounted;
    	let dispose;

    	function voicerecognition_noteContent_binding(value) {
    		/*voicerecognition_noteContent_binding*/ ctx[7](value);
    	}

    	let voicerecognition_props = {};

    	if (/*text*/ ctx[0] !== void 0) {
    		voicerecognition_props.noteContent = /*text*/ ctx[0];
    	}

    	voicerecognition = new VoiceRecognition({
    			props: voicerecognition_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(voicerecognition, 'noteContent', voicerecognition_noteContent_binding));

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 20
    	};

    	handle_promise(promise = /*topTimesText*/ ctx[2], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "When2Speech";
    			t1 = space();
    			h20 = element("h2");
    			h20.textContent = "A speech and text based way to find times to meet with others.";
    			t3 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Share Your Availability";
    			t5 = space();
    			label = element("label");
    			h30 = element("h3");
    			h30.textContent = "Name?";
    			t7 = space();
    			input0 = element("input");
    			t8 = space();
    			h31 = element("h3");
    			h31.textContent = "When are you available to meet?";
    			t10 = space();
    			p = element("p");
    			b0 = element("b");
    			b0.textContent = "Voice Record";
    			t12 = text(" or ");
    			b1 = element("b");
    			b1.textContent = "Type";
    			t14 = text(" your availability. Start with the ");
    			u0 = element("u");
    			u0.textContent = "day of the week";
    			t16 = text(" followed by the ");
    			i0 = element("i");
    			i0.textContent = "times";
    			t18 = text(". For example, you can say, I'm free... \"");
    			u1 = element("u");
    			u1.textContent = "Monday";
    			t20 = space();
    			i1 = element("i");
    			i1.textContent = "9am-10am";
    			t22 = text(" and ");
    			i2 = element("i");
    			i2.textContent = "11am-12pm";
    			t24 = text(", ");
    			u2 = element("u");
    			u2.textContent = "Tuesday";
    			t26 = space();
    			i3 = element("i");
    			i3.textContent = "except 3-4pm";
    			t28 = text(", Wednesday after 3pm\" and so on... Be sure to indicate AM or PM.");
    			t29 = space();
    			create_component(voicerecognition.$$.fragment);
    			t30 = space();
    			textarea = element("textarea");
    			t31 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t32 = space();
    			input1 = element("input");
    			t33 = space();
    			br2 = element("br");
    			t34 = space();
    			div1 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Top Times for Everyone";
    			t36 = space();
    			info.block.c();
    			attr_dev(h1, "class", "svelte-n0rlhk");
    			add_location(h1, file$5, 139, 1, 4753);
    			add_location(h20, file$5, 140, 1, 4775);
    			add_location(h21, file$5, 143, 3, 4909);
    			add_location(h30, file$5, 144, 21, 4963);
    			attr_dev(label, "for", "name");
    			add_location(label, file$5, 144, 3, 4945);
    			attr_dev(input0, "id", "name");
    			add_location(input0, file$5, 145, 3, 4989);
    			add_location(h31, file$5, 146, 3, 5028);
    			add_location(b0, file$5, 147, 6, 5075);
    			add_location(b1, file$5, 147, 29, 5098);
    			add_location(u0, file$5, 147, 75, 5144);
    			add_location(i0, file$5, 147, 114, 5183);
    			add_location(u1, file$5, 147, 167, 5236);
    			add_location(i1, file$5, 147, 181, 5250);
    			add_location(i2, file$5, 147, 201, 5270);
    			add_location(u2, file$5, 147, 219, 5288);
    			add_location(i3, file$5, 147, 234, 5303);
    			add_location(p, file$5, 147, 3, 5072);
    			attr_dev(textarea, "aria-label", "an input field for your availability");
    			attr_dev(textarea, "placeholder", "");
    			attr_dev(textarea, "class", "svelte-n0rlhk");
    			add_location(textarea, file$5, 149, 3, 5462);
    			add_location(br0, file$5, 150, 3, 5593);
    			add_location(br1, file$5, 150, 7, 5597);
    			attr_dev(input1, "class", "submit svelte-n0rlhk");
    			attr_dev(input1, "type", "button");
    			input1.value = "Submit";
    			add_location(input1, file$5, 151, 3, 5605);
    			add_location(br2, file$5, 152, 3, 5678);
    			attr_dev(div0, "class", "input-side svelte-n0rlhk");
    			attr_dev(div0, "role", "region");
    			add_location(div0, file$5, 142, 2, 4867);
    			add_location(h22, file$5, 158, 3, 5815);
    			attr_dev(div1, "class", "top-times-side svelte-n0rlhk");
    			attr_dev(div1, "role", "region");
    			add_location(div1, file$5, 157, 2, 5769);
    			attr_dev(div2, "class", "cf svelte-n0rlhk");
    			add_location(div2, file$5, 141, 1, 4848);
    			attr_dev(main, "class", "svelte-n0rlhk");
    			add_location(main, file$5, 138, 0, 4745);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, h20);
    			append_dev(main, t3);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h21);
    			append_dev(div0, t5);
    			append_dev(div0, label);
    			append_dev(label, h30);
    			append_dev(div0, t7);
    			append_dev(div0, input0);
    			set_input_value(input0, /*name*/ ctx[1]);
    			append_dev(div0, t8);
    			append_dev(div0, h31);
    			append_dev(div0, t10);
    			append_dev(div0, p);
    			append_dev(p, b0);
    			append_dev(p, t12);
    			append_dev(p, b1);
    			append_dev(p, t14);
    			append_dev(p, u0);
    			append_dev(p, t16);
    			append_dev(p, i0);
    			append_dev(p, t18);
    			append_dev(p, u1);
    			append_dev(p, t20);
    			append_dev(p, i1);
    			append_dev(p, t22);
    			append_dev(p, i2);
    			append_dev(p, t24);
    			append_dev(p, u2);
    			append_dev(p, t26);
    			append_dev(p, i3);
    			append_dev(p, t28);
    			append_dev(div0, t29);
    			mount_component(voicerecognition, div0, null);
    			append_dev(div0, t30);
    			append_dev(div0, textarea);
    			set_input_value(textarea, /*text*/ ctx[0]);
    			append_dev(div0, t31);
    			append_dev(div0, br0);
    			append_dev(div0, br1);
    			append_dev(div0, t32);
    			append_dev(div0, input1);
    			append_dev(div0, t33);
    			append_dev(div0, br2);
    			append_dev(div2, t34);
    			append_dev(div2, div1);
    			append_dev(div1, h22);
    			append_dev(div1, t36);
    			info.block.m(div1, info.anchor = null);
    			info.mount = () => div1;
    			info.anchor = null;
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[8]),
    					listen_dev(textarea, "input", /*handleInput*/ ctx[4], false, false, false),
    					listen_dev(input1, "click", /*submit*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*name*/ 2 && input0.value !== /*name*/ ctx[1]) {
    				set_input_value(input0, /*name*/ ctx[1]);
    			}

    			const voicerecognition_changes = {};

    			if (!updating_noteContent && dirty & /*text*/ 1) {
    				updating_noteContent = true;
    				voicerecognition_changes.noteContent = /*text*/ ctx[0];
    				add_flush_callback(() => updating_noteContent = false);
    			}

    			voicerecognition.$set(voicerecognition_changes);

    			if (dirty & /*text*/ 1) {
    				set_input_value(textarea, /*text*/ ctx[0]);
    			}

    			info.ctx = ctx;

    			if (dirty & /*topTimesText*/ 4 && promise !== (promise = /*topTimesText*/ ctx[2]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(voicerecognition.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(voicerecognition.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(voicerecognition);
    			info.block.d();
    			info.token = null;
    			info = null;
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let timeArr;
    	let $storedData;
    	validate_store(storedData, 'storedData');
    	component_subscribe($$self, storedData, $$value => $$invalidate(11, $storedData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputTimes', slots, []);
    	const dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    	let voiceText = '';
    	let typedText = '';
    	let name = '';
    	let text = '';
    	let availableTimes = null;
    	let API_BASE = 'http://localhost:3001';
    	let topIntervals = getTopNIntervals(getAllUserTimes(true), 5);

    	// console.log(topIntervals);
    	getTimes();

    	// Concepts incorporated: Rendering Times
    	let topTimesText = topTimesToText(topIntervals);

    	async function topTimesToText(topIntervalsPromise) {
    		// console.log({topIntervalsPromise})
    		let topIntervals = await topIntervalsPromise;

    		// console.log({topIntervals})
    		let topTimesText = [];

    		topIntervals.forEach(interval => {
    			let day = interval['start'][0];
    			let startMin = interval['start'][2];
    			let startMeridiem = 'am';

    			if (interval['start'][1] > 12) {
    				interval['start'][1] -= 12;
    				startMeridiem = 'pm';
    			}

    			let startTime = interval['start'][1] + ':' + (startMin == 0 ? '00' : startMin.toString()) + startMeridiem;
    			let endMin = interval['end'][2];
    			let endMeridiem = 'am';

    			if (interval['end'][1] > 12) {
    				interval['end'][1] -= 12;
    				endMeridiem = 'pm';
    			}

    			let endTime = interval['end'][1] + ':' + (endMin == 0 ? '00' : endMin.toString()) + endMeridiem;

    			// Currently incorrect, but user does not see. The current day's month/day for setting up a datetime are eventually discarded in the display and only the hours/minutes are accurate
    			let currentDate = new Date();

    			// Also incorrect in that doesn't support timezones (beyond Boston/NY GMT-5)
    			// subtract 5 because dateTime is in local time zone GMT-5 where i'm coding, but eventually toISOString changes it to UTC time zone
    			let startDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), interval['start'][1] - 5, interval['start'][2]);

    			let endDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), interval['end'][1] - 5, interval['end'][2]);
    			startDateTime = startDateTime.toISOString();
    			endDateTime = endDateTime.toISOString();
    			let numUsers = interval['users'].size;
    			let users = Array.from(interval['users']).join(', ');

    			let accessibleStartDate = accessibleDate(startDateTime, {
    				format: `H MM m to `,
    				language: `en`,
    				military: false
    			});

    			let accessibleEndDate = accessibleDate(endDateTime, {
    				format: `H MM m`,
    				language: `en`,
    				military: false
    			});

    			let accessibleTime = dayArr[day] + " " + accessibleStartDate + " " + accessibleEndDate;

    			topTimesText.push({
    				day,
    				startTime,
    				endTime,
    				numUsers,
    				users,
    				accessibleTime
    			});
    		});

    		return topTimesText;
    	}

    	// Concepts incorporated: Time Text Description
    	function handleInput() {
    		availableTimes = processText(text);
    	}

    	async function getTimes() {
    		const data = await (await fetch(API_BASE + '/userTimes')).json();
    		return data;
    	}

    	async function postTimes(username, userTimes) {
    		const strUserTimes = JSON.stringify(userTimes);

    		const requestOptions = {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({ name: username, times: strUserTimes })
    		};

    		const data = await (await fetch(API_BASE + '/userTimes', requestOptions)).json();

    		// console.log(data)
    		return data;
    	}

    	async function submit() {
    		if (name === '') {
    			alert('please include name!');
    		} else {
    			availableTimes = processText(text);
    			postTimes(name, availableTimes);
    			let userTimes = await getAllUserTimes(true);
    			$$invalidate(2, topTimesText = topTimesToText(getTopNIntervals(userTimes, 5)));
    			storedData.set($storedData.concat(userTimes[userTimes.length - 1]["times"]));
    			$$invalidate(1, name = '');
    			$$invalidate(0, text = '');
    		}

    		// window.location.reload();
    		console.log($storedData);
    	}

    	// Concepts incorporated: User
    	async function getAllUserTimes(allInfo = false) {
    		let userTimes = [];
    		let payload = await getTimes();

    		// console.log({payload})
    		for (let i = 0; i < payload.length; i++) {
    			// console.log(`getting user times: ${JSON.parse(payload[i].times)}`)
    			if (allInfo) {
    				userTimes.push({
    					name: payload[i].name,
    					times: JSON.parse(payload[i].times)
    				});
    			} else {
    				userTimes.push(JSON.parse(payload[i].times));
    			}
    		}

    		// console.log(userTimes)
    		return userTimes;
    	}
    	console.log($storedData);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<InputTimes> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	function voicerecognition_noteContent_binding(value) {
    		text = value;
    		$$invalidate(0, text);
    	}

    	function textarea_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	$$self.$capture_state = () => ({
    		VoiceRecognition,
    		processText,
    		makeTimeArr,
    		getTopNIntervals,
    		Table,
    		storedData,
    		currentUser,
    		dayArr,
    		voiceText,
    		typedText,
    		name,
    		text,
    		availableTimes,
    		API_BASE,
    		accessibleDate,
    		topIntervals,
    		topTimesText,
    		topTimesToText,
    		handleInput,
    		getTimes,
    		postTimes,
    		submit,
    		getAllUserTimes,
    		timeArr,
    		$storedData
    	});

    	$$self.$inject_state = $$props => {
    		if ('voiceText' in $$props) voiceText = $$props.voiceText;
    		if ('typedText' in $$props) typedText = $$props.typedText;
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('availableTimes' in $$props) availableTimes = $$props.availableTimes;
    		if ('API_BASE' in $$props) API_BASE = $$props.API_BASE;
    		if ('topIntervals' in $$props) topIntervals = $$props.topIntervals;
    		if ('topTimesText' in $$props) $$invalidate(2, topTimesText = $$props.topTimesText);
    		if ('timeArr' in $$props) timeArr = $$props.timeArr;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*text*/ 1) {
    			timeArr = text
    			? makeTimeArr(processText(text))
    			: Array(24).fill(0).map(() => Array(7).fill(0));
    		}
    	};

    	return [
    		text,
    		name,
    		topTimesText,
    		dayArr,
    		handleInput,
    		submit,
    		input0_input_handler,
    		voicerecognition_noteContent_binding,
    		textarea_input_handler
    	];
    }

    class InputTimes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputTimes",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/NewEvent.svelte generated by Svelte v3.55.1 */

    const file$4 = "src/components/NewEvent.svelte";

    function create_fragment$4(ctx) {
    	let link0;
    	let t0;
    	let head;
    	let script;
    	let script_src_value;
    	let t1;
    	let link1;
    	let t2;
    	let main;
    	let h1;
    	let t4;
    	let div1;
    	let div0;
    	let label0;
    	let h20;
    	let t6;
    	let input;
    	let t7;
    	let div3;
    	let div2;
    	let label1;
    	let h21;
    	let t9;
    	let inclusive_dates;
    	let t10;
    	let div5;
    	let div4;
    	let label2;
    	let h22;
    	let t12;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let option8;
    	let option9;
    	let option10;
    	let option11;
    	let option12;
    	let option13;
    	let option14;
    	let option15;
    	let option16;
    	let option17;
    	let option18;
    	let option19;
    	let option20;
    	let option21;
    	let option22;
    	let option23;
    	let option24;
    	let option25;
    	let option26;
    	let option27;
    	let option28;
    	let option29;
    	let option30;
    	let option31;
    	let option32;
    	let option33;
    	let option34;
    	let option35;
    	let option36;
    	let option37;
    	let option38;
    	let option39;
    	let t53;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			t0 = space();
    			head = element("head");
    			script = element("script");
    			t1 = space();
    			link1 = element("link");
    			t2 = space();
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Create New Event";
    			t4 = space();
    			div1 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			h20 = element("h2");
    			h20.textContent = "Event Name";
    			t6 = space();
    			input = element("input");
    			t7 = space();
    			div3 = element("div");
    			div2 = element("div");
    			label1 = element("label");
    			h21 = element("h2");
    			h21.textContent = "Choose a Date Range";
    			t9 = space();
    			inclusive_dates = element("inclusive-dates");
    			t10 = space();
    			div5 = element("div");
    			div4 = element("div");
    			label2 = element("label");
    			h22 = element("h2");
    			h22.textContent = "Time Zone";
    			t12 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "(GMT -12:00) Eniwetok, Kwajalein";
    			option1 = element("option");
    			option1.textContent = "(GMT -11:00) Midway Island, Samoa";
    			option2 = element("option");
    			option2.textContent = "(GMT -10:00) Hawaii";
    			option3 = element("option");
    			option3.textContent = "(GMT -9:30) Taiohae";
    			option4 = element("option");
    			option4.textContent = "(GMT -9:00) Alaska";
    			option5 = element("option");
    			option5.textContent = "(GMT -8:00) Pacific Time (US & Canada)";
    			option6 = element("option");
    			option6.textContent = "(GMT -7:00) Mountain Time (US & Canada)";
    			option7 = element("option");
    			option7.textContent = "(GMT -6:00) Central Time (US & Canada), Mexico City";
    			option8 = element("option");
    			option8.textContent = "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima";
    			option9 = element("option");
    			option9.textContent = "(GMT -4:30) Caracas";
    			option10 = element("option");
    			option10.textContent = "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz";
    			option11 = element("option");
    			option11.textContent = "(GMT -3:30) Newfoundland";
    			option12 = element("option");
    			option12.textContent = "(GMT -3:00) Brazil, Buenos Aires, Georgetown";
    			option13 = element("option");
    			option13.textContent = "(GMT -2:00) Mid-Atlantic";
    			option14 = element("option");
    			option14.textContent = "(GMT -1:00) Azores, Cape Verde Islands";
    			option15 = element("option");
    			option15.textContent = "(GMT) Western Europe Time, London, Lisbon, Casablanca";
    			option16 = element("option");
    			option16.textContent = "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris";
    			option17 = element("option");
    			option17.textContent = "(GMT +2:00) Kaliningrad, South Africa";
    			option18 = element("option");
    			option18.textContent = "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg";
    			option19 = element("option");
    			option19.textContent = "(GMT +3:30) Tehran";
    			option20 = element("option");
    			option20.textContent = "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi";
    			option21 = element("option");
    			option21.textContent = "(GMT +4:30) Kabul";
    			option22 = element("option");
    			option22.textContent = "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent";
    			option23 = element("option");
    			option23.textContent = "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi";
    			option24 = element("option");
    			option24.textContent = "(GMT +5:45) Kathmandu, Pokhara";
    			option25 = element("option");
    			option25.textContent = "(GMT +6:00) Almaty, Dhaka, Colombo";
    			option26 = element("option");
    			option26.textContent = "(GMT +6:30) Yangon, Mandalay";
    			option27 = element("option");
    			option27.textContent = "(GMT +7:00) Bangkok, Hanoi, Jakarta";
    			option28 = element("option");
    			option28.textContent = "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong";
    			option29 = element("option");
    			option29.textContent = "(GMT +8:45) Eucla";
    			option30 = element("option");
    			option30.textContent = "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk";
    			option31 = element("option");
    			option31.textContent = "(GMT +9:30) Adelaide, Darwin";
    			option32 = element("option");
    			option32.textContent = "(GMT +10:00) Eastern Australia, Guam, Vladivostok";
    			option33 = element("option");
    			option33.textContent = "(GMT +10:30) Lord Howe Island";
    			option34 = element("option");
    			option34.textContent = "(GMT +11:00) Magadan, Solomon Islands, New Caledonia";
    			option35 = element("option");
    			option35.textContent = "(GMT +11:30) Norfolk Island";
    			option36 = element("option");
    			option36.textContent = "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka";
    			option37 = element("option");
    			option37.textContent = "(GMT +12:45) Chatham Islands";
    			option38 = element("option");
    			option38.textContent = "(GMT +13:00) Apia, Nukualofa";
    			option39 = element("option");
    			option39.textContent = "(GMT +14:00) Line Islands, Tokelau";
    			t53 = space();
    			button = element("button");
    			button.textContent = "Create Event";
    			attr_dev(link0, "href", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css");
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "integrity", "sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ");
    			attr_dev(link0, "crossorigin", "anonymous");
    			add_location(link0, file$4, 1, 1, 15);
    			attr_dev(script, "type", "module");
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/esm/inclusive-dates.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$4, 11, 2, 569);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/themes/light.css");
    			add_location(link1, file$4, 17, 2, 728);
    			add_location(head, file$4, 10, 0, 560);
    			add_location(h1, file$4, 24, 4, 858);
    			add_location(h20, file$4, 26, 37, 952);
    			attr_dev(label0, "for", "event-name");
    			add_location(label0, file$4, 26, 13, 928);
    			add_location(div0, file$4, 26, 8, 923);
    			attr_dev(input, "id", "event-name");
    			add_location(input, file$4, 27, 8, 994);
    			attr_dev(div1, "class", "form-element svelte-1cs5pz8");
    			add_location(div1, file$4, 25, 4, 888);
    			add_location(h21, file$4, 30, 37, 1120);
    			attr_dev(label1, "for", "date-range");
    			add_location(label1, file$4, 30, 13, 1096);
    			add_location(div2, file$4, 30, 8, 1091);
    			set_custom_element_data(inclusive_dates, "id", "date-range");
    			set_custom_element_data(inclusive_dates, "range", "");
    			set_custom_element_data(inclusive_dates, "label", "Choose a date range");
    			set_custom_element_data(inclusive_dates, "placeholder", "Try \"June 8 to 12\"");
    			set_custom_element_data(inclusive_dates, "show-today-button", "");
    			set_custom_element_data(inclusive_dates, "locale", "en-US");
    			set_custom_element_data(inclusive_dates, "disabled", "false");
    			set_custom_element_data(inclusive_dates, "input-should-format", "input-should-format");
    			set_custom_element_data(inclusive_dates, "show-month-stepper", "");
    			set_custom_element_data(inclusive_dates, "show-clear-button", "");
    			add_location(inclusive_dates, file$4, 31, 8, 1171);
    			attr_dev(div3, "class", "form-element svelte-1cs5pz8");
    			add_location(div3, file$4, 29, 4, 1056);
    			add_location(h22, file$4, 34, 43, 1514);
    			attr_dev(label2, "for", "time-zone-offset");
    			add_location(label2, file$4, 34, 13, 1484);
    			add_location(div4, file$4, 34, 8, 1479);
    			option0.__value = "-12:00";
    			option0.value = option0.__value;
    			add_location(option0, file$4, 37, 12, 1705);
    			option1.__value = "-11:00";
    			option1.value = option1.__value;
    			add_location(option1, file$4, 38, 12, 1782);
    			option2.__value = "-10:00";
    			option2.value = option2.__value;
    			add_location(option2, file$4, 39, 12, 1860);
    			option3.__value = "-09:50";
    			option3.value = option3.__value;
    			add_location(option3, file$4, 40, 12, 1924);
    			option4.__value = "-09:00";
    			option4.value = option4.__value;
    			add_location(option4, file$4, 41, 12, 1988);
    			option5.__value = "-08:00";
    			option5.value = option5.__value;
    			add_location(option5, file$4, 42, 12, 2051);
    			option6.__value = "-07:00";
    			option6.value = option6.__value;
    			add_location(option6, file$4, 43, 12, 2138);
    			option7.__value = "-06:00";
    			option7.value = option7.__value;
    			add_location(option7, file$4, 44, 12, 2226);
    			option8.__value = "-05:00";
    			option8.value = option8.__value;
    			option8.selected = "selected";
    			add_location(option8, file$4, 45, 12, 2326);
    			option9.__value = "-04:50";
    			option9.value = option9.__value;
    			add_location(option9, file$4, 46, 12, 2447);
    			option10.__value = "-04:00";
    			option10.value = option10.__value;
    			add_location(option10, file$4, 47, 12, 2511);
    			option11.__value = "-03:50";
    			option11.value = option11.__value;
    			add_location(option11, file$4, 48, 12, 2607);
    			option12.__value = "-03:00";
    			option12.value = option12.__value;
    			add_location(option12, file$4, 49, 12, 2676);
    			option13.__value = "-02:00";
    			option13.value = option13.__value;
    			add_location(option13, file$4, 50, 12, 2765);
    			option14.__value = "-01:00";
    			option14.value = option14.__value;
    			add_location(option14, file$4, 51, 12, 2834);
    			option15.__value = "+00:00";
    			option15.value = option15.__value;
    			add_location(option15, file$4, 52, 12, 2917);
    			option16.__value = "+01:00";
    			option16.value = option16.__value;
    			add_location(option16, file$4, 53, 12, 3015);
    			option17.__value = "+02:00";
    			option17.value = option17.__value;
    			add_location(option17, file$4, 54, 12, 3107);
    			option18.__value = "+03:00";
    			option18.value = option18.__value;
    			add_location(option18, file$4, 55, 12, 3189);
    			option19.__value = "+03:50";
    			option19.value = option19.__value;
    			add_location(option19, file$4, 56, 12, 3285);
    			option20.__value = "+04:00";
    			option20.value = option20.__value;
    			add_location(option20, file$4, 57, 12, 3348);
    			option21.__value = "+04:50";
    			option21.value = option21.__value;
    			add_location(option21, file$4, 58, 12, 3437);
    			option22.__value = "+05:00";
    			option22.value = option22.__value;
    			add_location(option22, file$4, 59, 12, 3499);
    			option23.__value = "+05:50";
    			option23.value = option23.__value;
    			add_location(option23, file$4, 60, 12, 3598);
    			option24.__value = "+05:75";
    			option24.value = option24.__value;
    			add_location(option24, file$4, 61, 12, 3690);
    			option25.__value = "+06:00";
    			option25.value = option25.__value;
    			add_location(option25, file$4, 62, 12, 3765);
    			option26.__value = "+06:50";
    			option26.value = option26.__value;
    			add_location(option26, file$4, 63, 12, 3844);
    			option27.__value = "+07:00";
    			option27.value = option27.__value;
    			add_location(option27, file$4, 64, 12, 3917);
    			option28.__value = "+08:00";
    			option28.value = option28.__value;
    			add_location(option28, file$4, 65, 12, 3997);
    			option29.__value = "+08:75";
    			option29.value = option29.__value;
    			add_location(option29, file$4, 66, 12, 4090);
    			option30.__value = "+09:00";
    			option30.value = option30.__value;
    			add_location(option30, file$4, 67, 12, 4152);
    			option31.__value = "+09:50";
    			option31.value = option31.__value;
    			add_location(option31, file$4, 68, 12, 4246);
    			option32.__value = "+10:00";
    			option32.value = option32.__value;
    			add_location(option32, file$4, 69, 12, 4319);
    			option33.__value = "+10:50";
    			option33.value = option33.__value;
    			add_location(option33, file$4, 70, 12, 4413);
    			option34.__value = "+11:00";
    			option34.value = option34.__value;
    			add_location(option34, file$4, 71, 12, 4487);
    			option35.__value = "+11:50";
    			option35.value = option35.__value;
    			add_location(option35, file$4, 72, 12, 4584);
    			option36.__value = "+12:00";
    			option36.value = option36.__value;
    			add_location(option36, file$4, 73, 12, 4656);
    			option37.__value = "+12:75";
    			option37.value = option37.__value;
    			add_location(option37, file$4, 74, 12, 4751);
    			option38.__value = "+13:00";
    			option38.value = option38.__value;
    			add_location(option38, file$4, 75, 12, 4824);
    			option39.__value = "+14:00";
    			option39.value = option39.__value;
    			add_location(option39, file$4, 76, 12, 4897);
    			attr_dev(select, "name", "timezone_offset");
    			attr_dev(select, "id", "timezone-offset");
    			attr_dev(select, "class", "span5");
    			add_location(select, file$4, 36, 8, 1626);
    			attr_dev(div5, "class", "form-element svelte-1cs5pz8");
    			add_location(div5, file$4, 33, 4, 1444);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary btn-lg");
    			add_location(button, file$4, 79, 4, 4997);
    			add_location(main, file$4, 23, 0, 847);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, head, anchor);
    			append_dev(head, script);
    			append_dev(head, t1);
    			append_dev(head, link1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t4);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(label0, h20);
    			append_dev(div1, t6);
    			append_dev(div1, input);
    			set_input_value(input, /*eventName*/ ctx[0]);
    			append_dev(main, t7);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, label1);
    			append_dev(label1, h21);
    			append_dev(div3, t9);
    			append_dev(div3, inclusive_dates);
    			append_dev(main, t10);
    			append_dev(main, div5);
    			append_dev(div5, div4);
    			append_dev(div4, label2);
    			append_dev(label2, h22);
    			append_dev(div5, t12);
    			append_dev(div5, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(select, option5);
    			append_dev(select, option6);
    			append_dev(select, option7);
    			append_dev(select, option8);
    			append_dev(select, option9);
    			append_dev(select, option10);
    			append_dev(select, option11);
    			append_dev(select, option12);
    			append_dev(select, option13);
    			append_dev(select, option14);
    			append_dev(select, option15);
    			append_dev(select, option16);
    			append_dev(select, option17);
    			append_dev(select, option18);
    			append_dev(select, option19);
    			append_dev(select, option20);
    			append_dev(select, option21);
    			append_dev(select, option22);
    			append_dev(select, option23);
    			append_dev(select, option24);
    			append_dev(select, option25);
    			append_dev(select, option26);
    			append_dev(select, option27);
    			append_dev(select, option28);
    			append_dev(select, option29);
    			append_dev(select, option30);
    			append_dev(select, option31);
    			append_dev(select, option32);
    			append_dev(select, option33);
    			append_dev(select, option34);
    			append_dev(select, option35);
    			append_dev(select, option36);
    			append_dev(select, option37);
    			append_dev(select, option38);
    			append_dev(select, option39);
    			append_dev(main, t53);
    			append_dev(main, button);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*eventName*/ 1 && input.value !== /*eventName*/ ctx[0]) {
    				set_input_value(input, /*eventName*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(head);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NewEvent', slots, []);
    	let eventName = '';
    	let startDate = '';
    	let endDate = '';
    	let timeZone = '';
    	let { onNewEvent } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (onNewEvent === undefined && !('onNewEvent' in $$props || $$self.$$.bound[$$self.$$.props['onNewEvent']])) {
    			console.warn("<NewEvent> was created without expected prop 'onNewEvent'");
    		}
    	});

    	const writable_props = ['onNewEvent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NewEvent> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		eventName = this.value;
    		$$invalidate(0, eventName);
    	}

    	$$self.$$set = $$props => {
    		if ('onNewEvent' in $$props) $$invalidate(1, onNewEvent = $$props.onNewEvent);
    	};

    	$$self.$capture_state = () => ({
    		eventName,
    		startDate,
    		endDate,
    		timeZone,
    		onNewEvent
    	});

    	$$self.$inject_state = $$props => {
    		if ('eventName' in $$props) $$invalidate(0, eventName = $$props.eventName);
    		if ('startDate' in $$props) startDate = $$props.startDate;
    		if ('endDate' in $$props) endDate = $$props.endDate;
    		if ('timeZone' in $$props) timeZone = $$props.timeZone;
    		if ('onNewEvent' in $$props) $$invalidate(1, onNewEvent = $$props.onNewEvent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [eventName, onNewEvent, input_input_handler];
    }

    class NewEvent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { onNewEvent: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewEvent",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get onNewEvent() {
    		throw new Error("<NewEvent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onNewEvent(value) {
    		throw new Error("<NewEvent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/HomePage.svelte generated by Svelte v3.55.1 */

    const file$3 = "src/components/HomePage.svelte";

    function create_fragment$3(ctx) {
    	let link0;
    	let t0;
    	let head;
    	let script;
    	let script_src_value;
    	let t1;
    	let link1;
    	let t2;
    	let main;
    	let button0;
    	let t4;
    	let button1;

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			t0 = space();
    			head = element("head");
    			script = element("script");
    			t1 = space();
    			link1 = element("link");
    			t2 = space();
    			main = element("main");
    			button0 = element("button");
    			button0.textContent = "Create New Event";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Enter Existing Event";
    			attr_dev(link0, "href", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css");
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "integrity", "sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ");
    			attr_dev(link0, "crossorigin", "anonymous");
    			add_location(link0, file$3, 1, 1, 15);
    			attr_dev(script, "type", "module");
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/esm/inclusive-dates.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$3, 11, 2, 569);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/themes/light.css");
    			add_location(link1, file$3, 17, 2, 728);
    			add_location(head, file$3, 10, 0, 560);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-primary btn-lg");
    			add_location(button0, file$3, 24, 4, 858);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-primary btn-lg");
    			add_location(button1, file$3, 25, 4, 941);
    			add_location(main, file$3, 23, 0, 847);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, head, anchor);
    			append_dev(head, script);
    			append_dev(head, t1);
    			append_dev(head, link1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, button0);
    			append_dev(main, t4);
    			append_dev(main, button1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(head);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HomePage', slots, []);
    	let eventName = '';
    	let startDate = '';
    	let endDate = '';
    	let timeZone = '';
    	let { onNewEvent } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (onNewEvent === undefined && !('onNewEvent' in $$props || $$self.$$.bound[$$self.$$.props['onNewEvent']])) {
    			console.warn("<HomePage> was created without expected prop 'onNewEvent'");
    		}
    	});

    	const writable_props = ['onNewEvent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HomePage> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onNewEvent' in $$props) $$invalidate(0, onNewEvent = $$props.onNewEvent);
    	};

    	$$self.$capture_state = () => ({
    		eventName,
    		startDate,
    		endDate,
    		timeZone,
    		onNewEvent
    	});

    	$$self.$inject_state = $$props => {
    		if ('eventName' in $$props) eventName = $$props.eventName;
    		if ('startDate' in $$props) startDate = $$props.startDate;
    		if ('endDate' in $$props) endDate = $$props.endDate;
    		if ('timeZone' in $$props) timeZone = $$props.timeZone;
    		if ('onNewEvent' in $$props) $$invalidate(0, onNewEvent = $$props.onNewEvent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onNewEvent];
    }

    class HomePage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { onNewEvent: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomePage",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get onNewEvent() {
    		throw new Error("<HomePage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onNewEvent(value) {
    		throw new Error("<HomePage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ExistingEvent.svelte generated by Svelte v3.55.1 */

    const file$2 = "src/components/ExistingEvent.svelte";

    function create_fragment$2(ctx) {
    	let link0;
    	let t0;
    	let head;
    	let script;
    	let script_src_value;
    	let t1;
    	let link1;
    	let t2;
    	let main;
    	let div1;
    	let div0;
    	let h2;
    	let t4;
    	let label;
    	let h3;
    	let t6;
    	let input0;
    	let t7;
    	let input1;
    	let t8;
    	let br;
    	let t9;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			t0 = space();
    			head = element("head");
    			script = element("script");
    			t1 = space();
    			link1 = element("link");
    			t2 = space();
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Enter Event Code";
    			t4 = space();
    			label = element("label");
    			h3 = element("h3");
    			h3.textContent = "Event Code";
    			t6 = space();
    			input0 = element("input");
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			br = element("br");
    			t9 = space();
    			button = element("button");
    			button.textContent = "Enter Existing Event";
    			attr_dev(link0, "href", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css");
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "integrity", "sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ");
    			attr_dev(link0, "crossorigin", "anonymous");
    			add_location(link0, file$2, 1, 1, 15);
    			attr_dev(script, "type", "module");
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/esm/inclusive-dates.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$2, 12, 2, 591);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/themes/light.css");
    			add_location(link1, file$2, 18, 2, 750);
    			add_location(head, file$2, 11, 0, 582);
    			add_location(h2, file$2, 27, 6, 946);
    			add_location(h3, file$2, 28, 29, 1001);
    			attr_dev(label, "for", "eventcode");
    			add_location(label, file$2, 28, 6, 978);
    			attr_dev(input0, "id", "eventcode");
    			add_location(input0, file$2, 29, 6, 1035);
    			attr_dev(input1, "class", "submit");
    			attr_dev(input1, "type", "button");
    			input1.value = "Submit";
    			add_location(input1, file$2, 30, 6, 1087);
    			add_location(br, file$2, 31, 6, 1145);
    			attr_dev(div0, "class", "input-side");
    			attr_dev(div0, "role", "region");
    			add_location(div0, file$2, 26, 4, 901);
    			attr_dev(div1, "class", "cf");
    			add_location(div1, file$2, 25, 4, 880);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary btn-lg");
    			add_location(button, file$2, 34, 4, 1174);
    			add_location(main, file$2, 24, 0, 869);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, head, anchor);
    			append_dev(head, script);
    			append_dev(head, t1);
    			append_dev(head, link1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t4);
    			append_dev(div0, label);
    			append_dev(label, h3);
    			append_dev(div0, t6);
    			append_dev(div0, input0);
    			set_input_value(input0, /*eventcode*/ ctx[0]);
    			append_dev(div0, t7);
    			append_dev(div0, input1);
    			append_dev(div0, t8);
    			append_dev(div0, br);
    			append_dev(main, t9);
    			append_dev(main, button);

    			if (!mounted) {
    				dispose = listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*eventcode*/ 1 && input0.value !== /*eventcode*/ ctx[0]) {
    				set_input_value(input0, /*eventcode*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(head);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExistingEvent', slots, []);
    	let eventName = '';
    	let startDate = '';
    	let endDate = '';
    	let timeZone = '';
    	let eventcode = '';
    	let { onNewEvent } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (onNewEvent === undefined && !('onNewEvent' in $$props || $$self.$$.bound[$$self.$$.props['onNewEvent']])) {
    			console.warn("<ExistingEvent> was created without expected prop 'onNewEvent'");
    		}
    	});

    	const writable_props = ['onNewEvent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExistingEvent> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		eventcode = this.value;
    		$$invalidate(0, eventcode);
    	}

    	$$self.$$set = $$props => {
    		if ('onNewEvent' in $$props) $$invalidate(1, onNewEvent = $$props.onNewEvent);
    	};

    	$$self.$capture_state = () => ({
    		eventName,
    		startDate,
    		endDate,
    		timeZone,
    		eventcode,
    		onNewEvent
    	});

    	$$self.$inject_state = $$props => {
    		if ('eventName' in $$props) eventName = $$props.eventName;
    		if ('startDate' in $$props) startDate = $$props.startDate;
    		if ('endDate' in $$props) endDate = $$props.endDate;
    		if ('timeZone' in $$props) timeZone = $$props.timeZone;
    		if ('eventcode' in $$props) $$invalidate(0, eventcode = $$props.eventcode);
    		if ('onNewEvent' in $$props) $$invalidate(1, onNewEvent = $$props.onNewEvent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [eventcode, onNewEvent, input0_input_handler];
    }

    class ExistingEvent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { onNewEvent: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExistingEvent",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get onNewEvent() {
    		throw new Error("<ExistingEvent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onNewEvent(value) {
    		throw new Error("<ExistingEvent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/index.svelte generated by Svelte v3.55.1 */
    const file$1 = "src/routes/index.svelte";

    // (13:0) <Router {url}>
    function create_default_slot(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let current;

    	route0 = new Route({
    			props: { path: "input", component: InputTimes },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: { path: "new", component: NewEvent },
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/existing",
    				component: ExistingEvent
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: { path: "/", component: HomePage },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			add_location(div, file$1, 13, 2, 351);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t0);
    			mount_component(route1, div, null);
    			append_dev(div, t1);
    			mount_component(route2, div, null);
    			append_dev(div, t2);
    			mount_component(route3, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(13:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Routes', slots, []);
    	let { url = '' } = $$props;
    	const writable_props = ['url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Routes> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		InputTimes,
    		NewEvent,
    		HomePage,
    		ExistingEvent,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class Routes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Routes",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get url() {
    		throw new Error("<Routes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Routes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.55.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;
    	router = new Routes({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			attr_dev(main, "class", "svelte-nr8nr5");
    			add_location(main, file, 11, 0, 141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router: Routes });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
