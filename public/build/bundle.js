
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
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
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
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
    function create_if_block$2(ctx) {
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
    		id: create_if_block$2.name,
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
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$2(ctx);

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
    					if_block = create_if_block$2(ctx);
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
    function create_if_block$1(ctx) {
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
    		id: create_if_block$1.name,
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
    	let if_block = /*isActive*/ ctx[0] && create_if_block$1(ctx);

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
    					if_block = create_if_block$1(ctx);
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
    function createSharedCalendar(userTimes) {
    	console.log({userTimes});
    	let userTimesPayload = userTimes;
    	let sharedCalendar = createEmptyCalendar();
    	console.log({userTimesPayload});
    	userTimesPayload.forEach(obj => {
    		if (obj) {
    			let user = obj['name'];
    			let availableTimes = JSON.parse(obj['times']);
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
    function getTopNIntervals(userTimesPromise, N) {
    	let userTimes = userTimesPromise;
    	console.log({userTimes});
    	let sharedCalendar = createSharedCalendar(userTimes);
    	console.log({sharedCalendar});
    	let sharedIntervals = [];
    	let ongoingIntervals = new Set();

    	for (let d = 0; d < 7; d++) {
    		for (let h = MIN_HOUR; h <= MAX_HOUR; h++) {
    			for (let m = 0; m < 60; m+=15) {
    				let cal = sharedCalendar[d][h+'-'+m];
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

    // index.ts
    var stores = {};
    function getStorage(type) {
      return type === "local" ? localStorage : sessionStorage;
    }
    function persisted(key, initialValue, options) {
      const serializer = (options == null ? void 0 : options.serializer) ?? JSON;
      const storageType = (options == null ? void 0 : options.storage) ?? "local";
      const browser = typeof window !== "undefined" && typeof document !== "undefined";
      function updateStorage(key2, value) {
        if (!browser)
          return;
        getStorage(storageType).setItem(key2, serializer.stringify(value));
      }
      if (!stores[key]) {
        const store = writable(initialValue, (set2) => {
          const json = browser ? getStorage(storageType).getItem(key) : null;
          if (json) {
            set2(serializer.parse(json));
          }
          if (browser) {
            const handleStorage = (event) => {
              if (event.key === key)
                set2(event.newValue ? serializer.parse(event.newValue) : null);
            };
            window.addEventListener("storage", handleStorage);
            return () => window.removeEventListener("storage", handleStorage);
          }
        });
        const { subscribe, set } = store;
        stores[key] = {
          set(value) {
            updateStorage(key, value);
            set(value);
          },
          update(updater) {
            const value = updater(get_store_value(store));
            updateStorage(key, value);
            set(value);
          },
          subscribe
        };
      }
      return stores[key];
    }

    // concept: log in by name
    let storedData = persisted('storedData', {});
    let currentUser = persisted('currentUser', "");
    let currentEvent = persisted('currentEvent', "");
    let eventProperties = persisted('eventProperties', {});

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

    const { Object: Object_1$1, console: console_1$1 } = globals;
    const file$5 = "src/components/InputTimes.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
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

    // (245:3) {:then topTimes}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*topTimes*/ ctx[23];
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
    			if (dirty & /*topTimesText, dayArr*/ 24) {
    				each_value = /*topTimes*/ ctx[23];
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
    		source: "(245:3) {:then topTimes}",
    		ctx
    	});

    	return block;
    }

    // (246:3) {#each topTimes as time}
    function create_each_block(ctx) {
    	let div;
    	let p;
    	let b;
    	let time;
    	let t0_value = /*dayArr*/ ctx[4][/*time*/ ctx[24].day] + "";
    	let t0;
    	let t1;
    	let t2_value = /*time*/ ctx[24].startTime + "";
    	let t2;
    	let t3;
    	let t4_value = /*time*/ ctx[24].endTime + "";
    	let t4;
    	let time_aria_label_value;
    	let t5;
    	let br0;
    	let t6;
    	let u;
    	let t7_value = /*time*/ ctx[24].numUsers + "";
    	let t7;
    	let t8;
    	let br1;
    	let t9;
    	let t10_value = /*time*/ ctx[24].users + "";
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
    			attr_dev(time, "aria-label", time_aria_label_value = /*time*/ ctx[24].accessibleTime);
    			add_location(time, file$5, 247, 11, 8932);
    			add_location(b, file$5, 247, 8, 8929);
    			add_location(br0, file$5, 248, 5, 9052);
    			add_location(u, file$5, 249, 5, 9062);
    			add_location(br1, file$5, 249, 34, 9091);
    			add_location(p, file$5, 247, 5, 8926);
    			attr_dev(div, "class", "top-time svelte-17m2dzw");
    			add_location(div, file$5, 246, 4, 8896);
    			add_location(br2, file$5, 252, 4, 9135);
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
    			if (dirty & /*topTimesText*/ 8 && t0_value !== (t0_value = /*dayArr*/ ctx[4][/*time*/ ctx[24].day] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*topTimesText*/ 8 && t2_value !== (t2_value = /*time*/ ctx[24].startTime + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*topTimesText*/ 8 && t4_value !== (t4_value = /*time*/ ctx[24].endTime + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*topTimesText*/ 8 && time_aria_label_value !== (time_aria_label_value = /*time*/ ctx[24].accessibleTime)) {
    				attr_dev(time, "aria-label", time_aria_label_value);
    			}

    			if (dirty & /*topTimesText*/ 8 && t7_value !== (t7_value = /*time*/ ctx[24].numUsers + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*topTimesText*/ 8 && t10_value !== (t10_value = /*time*/ ctx[24].users + "")) set_data_dev(t10, t10_value);
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
    		source: "(246:3) {#each topTimes as time}",
    		ctx
    	});

    	return block;
    }

    // (243:24)      <p>Processing Times...</p>    {:then topTimes}
    function create_pending_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Processing Times...";
    			add_location(p, file$5, 243, 4, 8817);
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
    		source: "(243:24)      <p>Processing Times...</p>    {:then topTimes}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let div3;
    	let div1;
    	let button;
    	let t1;
    	let h20;
    	let t2;
    	let t3;
    	let t4;
    	let h21;
    	let t6;
    	let div0;
    	let label0;
    	let h30;
    	let t8;
    	let input0;
    	let t9;
    	let h31;
    	let t11;
    	let p0;
    	let b0;
    	let t13;
    	let b1;
    	let t15;
    	let u0;
    	let t17;
    	let i0;
    	let t19;
    	let u1;
    	let t21;
    	let i1;
    	let t23;
    	let i2;
    	let t25;
    	let u2;
    	let t27;
    	let i3;
    	let t29;
    	let t30;
    	let voicerecognition;
    	let updating_noteContent;
    	let t31;
    	let textarea0;
    	let t32;
    	let br0;
    	let t33;
    	let input1;
    	let t34;
    	let br1;
    	let t35;
    	let label1;
    	let b2;
    	let p1;
    	let t38;
    	let textarea1;
    	let t39;
    	let br2;
    	let t40;
    	let p2;
    	let t41;
    	let input2;
    	let t42;
    	let br3;
    	let t43;
    	let div2;
    	let h22;
    	let t45;
    	let promise;
    	let current;
    	let mounted;
    	let dispose;

    	function voicerecognition_noteContent_binding(value) {
    		/*voicerecognition_noteContent_binding*/ ctx[10](value);
    	}

    	let voicerecognition_props = {};

    	if (/*text*/ ctx[2] !== void 0) {
    		voicerecognition_props.noteContent = /*text*/ ctx[2];
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
    		value: 23
    	};

    	handle_promise(promise = /*topTimesText*/ ctx[3], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Back to Home Page";
    			t1 = space();
    			h20 = element("h2");
    			t2 = text("Event: ");
    			t3 = text(/*eventID*/ ctx[0]);
    			t4 = space();
    			h21 = element("h2");
    			h21.textContent = "Share Your Availability";
    			t6 = space();
    			div0 = element("div");
    			label0 = element("label");
    			h30 = element("h3");
    			h30.textContent = "Name:";
    			t8 = space();
    			input0 = element("input");
    			t9 = space();
    			h31 = element("h3");
    			h31.textContent = "When are you available to meet?";
    			t11 = space();
    			p0 = element("p");
    			b0 = element("b");
    			b0.textContent = "Voice Record";
    			t13 = text(" or ");
    			b1 = element("b");
    			b1.textContent = "Type";
    			t15 = text(" your availability into the box below. Start with the ");
    			u0 = element("u");
    			u0.textContent = "day of the week";
    			t17 = text(" followed by the ");
    			i0 = element("i");
    			i0.textContent = "times";
    			t19 = text(". For example, you can say, I'm free... \"");
    			u1 = element("u");
    			u1.textContent = "Monday";
    			t21 = space();
    			i1 = element("i");
    			i1.textContent = "9am-10am";
    			t23 = text(" and ");
    			i2 = element("i");
    			i2.textContent = "11am-12pm";
    			t25 = text(", ");
    			u2 = element("u");
    			u2.textContent = "Tuesday";
    			t27 = space();
    			i3 = element("i");
    			i3.textContent = "except 3-4pm";
    			t29 = text(",\" and so on... Be sure to indicate AM or PM.");
    			t30 = space();
    			create_component(voicerecognition.$$.fragment);
    			t31 = space();
    			textarea0 = element("textarea");
    			t32 = space();
    			br0 = element("br");
    			t33 = space();
    			input1 = element("input");
    			t34 = space();
    			br1 = element("br");
    			t35 = space();
    			label1 = element("label");
    			b2 = element("b");
    			b2.textContent = "Parsed Availability";
    			p1 = element("p");
    			p1.textContent = "Here's what we got. Make any changes by editing the box above or re-recording and pressing \"Submit\" again.";
    			t38 = space();
    			textarea1 = element("textarea");
    			t39 = space();
    			br2 = element("br");
    			t40 = space();
    			p2 = element("p");
    			t41 = space();
    			input2 = element("input");
    			t42 = space();
    			br3 = element("br");
    			t43 = space();
    			div2 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Top Times for Everyone";
    			t45 = space();
    			info.block.c();
    			set_style(button, "float", "left");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary btn-lg");
    			add_location(button, file$5, 215, 3, 7159);
    			add_location(h20, file$5, 216, 3, 7298);
    			add_location(h21, file$5, 217, 3, 7327);
    			add_location(h30, file$5, 219, 38, 7428);
    			attr_dev(label0, "id", "name-label");
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-17m2dzw");
    			add_location(label0, file$5, 219, 4, 7394);
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "class", "svelte-17m2dzw");
    			add_location(input0, file$5, 220, 4, 7456);
    			attr_dev(div0, "class", "name-wrapper svelte-17m2dzw");
    			add_location(div0, file$5, 218, 3, 7363);
    			add_location(h31, file$5, 222, 3, 7505);
    			add_location(b0, file$5, 223, 6, 7552);
    			add_location(b1, file$5, 223, 29, 7575);
    			add_location(u0, file$5, 223, 94, 7640);
    			add_location(i0, file$5, 223, 133, 7679);
    			add_location(u1, file$5, 223, 186, 7732);
    			add_location(i1, file$5, 223, 200, 7746);
    			add_location(i2, file$5, 223, 220, 7766);
    			add_location(u2, file$5, 223, 238, 7784);
    			add_location(i3, file$5, 223, 253, 7799);
    			add_location(p0, file$5, 223, 3, 7549);
    			attr_dev(textarea0, "aria-label", "an input field for your availability");
    			attr_dev(textarea0, "placeholder", "");
    			attr_dev(textarea0, "class", "svelte-17m2dzw");
    			add_location(textarea0, file$5, 225, 3, 7938);
    			add_location(br0, file$5, 226, 3, 8063);
    			attr_dev(input1, "class", "submit svelte-17m2dzw");
    			attr_dev(input1, "id", "presub");
    			attr_dev(input1, "type", "button");
    			input1.value = "Submit";
    			add_location(input1, file$5, 227, 3, 8071);
    			add_location(br1, file$5, 228, 3, 8159);
    			add_location(b2, file$5, 229, 29, 8193);
    			attr_dev(label1, "for", "confirmation");
    			add_location(label1, file$5, 229, 3, 8167);
    			add_location(p1, file$5, 229, 63, 8227);
    			set_style(textarea1, "background-color", "white");
    			textarea1.readOnly = true;
    			attr_dev(textarea1, "id", "confirmation");
    			attr_dev(textarea1, "aria-label", "an input field to confirm availability");
    			attr_dev(textarea1, "placeholder", "");
    			attr_dev(textarea1, "class", "svelte-17m2dzw");
    			add_location(textarea1, file$5, 230, 3, 8344);
    			add_location(br2, file$5, 231, 3, 8496);
    			attr_dev(p2, "id", "edited");
    			add_location(p2, file$5, 232, 3, 8504);
    			attr_dev(input2, "class", "submit svelte-17m2dzw");
    			attr_dev(input2, "type", "button");
    			input2.value = "Submit Final Response";
    			add_location(input2, file$5, 233, 3, 8527);
    			add_location(br3, file$5, 234, 3, 8615);
    			attr_dev(div1, "class", "input-side svelte-17m2dzw");
    			attr_dev(div1, "role", "region");
    			add_location(div1, file$5, 214, 2, 7117);
    			add_location(h22, file$5, 241, 3, 8756);
    			attr_dev(div2, "class", "top-times-side svelte-17m2dzw");
    			attr_dev(div2, "role", "region");
    			add_location(div2, file$5, 240, 2, 8710);
    			attr_dev(div3, "class", "cf svelte-17m2dzw");
    			add_location(div3, file$5, 213, 1, 7098);
    			attr_dev(main, "class", "svelte-17m2dzw");
    			add_location(main, file$5, 212, 0, 7090);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div1);
    			append_dev(div1, button);
    			append_dev(div1, t1);
    			append_dev(div1, h20);
    			append_dev(h20, t2);
    			append_dev(h20, t3);
    			append_dev(div1, t4);
    			append_dev(div1, h21);
    			append_dev(div1, t6);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(label0, h30);
    			append_dev(div0, t8);
    			append_dev(div0, input0);
    			set_input_value(input0, /*name*/ ctx[1]);
    			append_dev(div1, t9);
    			append_dev(div1, h31);
    			append_dev(div1, t11);
    			append_dev(div1, p0);
    			append_dev(p0, b0);
    			append_dev(p0, t13);
    			append_dev(p0, b1);
    			append_dev(p0, t15);
    			append_dev(p0, u0);
    			append_dev(p0, t17);
    			append_dev(p0, i0);
    			append_dev(p0, t19);
    			append_dev(p0, u1);
    			append_dev(p0, t21);
    			append_dev(p0, i1);
    			append_dev(p0, t23);
    			append_dev(p0, i2);
    			append_dev(p0, t25);
    			append_dev(p0, u2);
    			append_dev(p0, t27);
    			append_dev(p0, i3);
    			append_dev(p0, t29);
    			append_dev(div1, t30);
    			mount_component(voicerecognition, div1, null);
    			append_dev(div1, t31);
    			append_dev(div1, textarea0);
    			set_input_value(textarea0, /*text*/ ctx[2]);
    			append_dev(div1, t32);
    			append_dev(div1, br0);
    			append_dev(div1, t33);
    			append_dev(div1, input1);
    			append_dev(div1, t34);
    			append_dev(div1, br1);
    			append_dev(div1, t35);
    			append_dev(div1, label1);
    			append_dev(label1, b2);
    			append_dev(div1, p1);
    			append_dev(div1, t38);
    			append_dev(div1, textarea1);
    			append_dev(div1, t39);
    			append_dev(div1, br2);
    			append_dev(div1, t40);
    			append_dev(div1, p2);
    			append_dev(div1, t41);
    			append_dev(div1, input2);
    			append_dev(div1, t42);
    			append_dev(div1, br3);
    			append_dev(div3, t43);
    			append_dev(div3, div2);
    			append_dev(div2, h22);
    			append_dev(div2, t45);
    			info.block.m(div2, info.anchor = null);
    			info.mount = () => div2;
    			info.anchor = null;
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(textarea0, "keyup", /*retro*/ ctx[7], false, false, false),
    					listen_dev(textarea0, "input", /*textarea0_input_handler*/ ctx[11]),
    					listen_dev(input1, "click", /*presubmit*/ ctx[6], false, false, false),
    					listen_dev(input2, "click", /*submit*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (!current || dirty & /*eventID*/ 1) set_data_dev(t3, /*eventID*/ ctx[0]);

    			if (dirty & /*name*/ 2 && input0.value !== /*name*/ ctx[1]) {
    				set_input_value(input0, /*name*/ ctx[1]);
    			}

    			const voicerecognition_changes = {};

    			if (!updating_noteContent && dirty & /*text*/ 4) {
    				updating_noteContent = true;
    				voicerecognition_changes.noteContent = /*text*/ ctx[2];
    				add_flush_callback(() => updating_noteContent = false);
    			}

    			voicerecognition.$set(voicerecognition_changes);

    			if (dirty & /*text*/ 4) {
    				set_input_value(textarea0, /*text*/ ctx[2]);
    			}

    			info.ctx = ctx;

    			if (dirty & /*topTimesText*/ 8 && promise !== (promise = /*topTimesText*/ ctx[3]) && handle_promise(promise, info)) ; else {
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

    function render(available) {
    	console.log(available);
    	let a = "";

    	for (let i = 0; i < Object.keys(available).length; i++) {
    		let k = Object.keys(available)[i];
    		let v = available[k];

    		for (let j = 0; j < v.length; j++) {
    			let start = String(v[j][0]);
    			let end = String(v[j][1]);

    			// remove timezone from confirmation text
    			console.log(start);

    			console.log(end);
    			start = start.substring(0, start.indexOf(" ("));
    			end = end.substring(0, end.indexOf(" ("));
    			a += start + " to " + end + ",\n";
    		}
    	}

    	return a;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $storedData;
    	let $currentEvent;
    	validate_store(storedData, 'storedData');
    	component_subscribe($$self, storedData, $$value => $$invalidate(15, $storedData = $$value));
    	validate_store(currentEvent, 'currentEvent');
    	component_subscribe($$self, currentEvent, $$value => $$invalidate(16, $currentEvent = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputTimes', slots, []);
    	const dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    	let { eventID } = $$props;
    	let name = '';
    	let text = '';
    	let availableTimes = null;
    	let API_BASE = 'http://localhost:3001';
    	let presubmitted = false;
    	let editedAfterPresubmit = false;
    	console.log("top of the interval");
    	let topIntervals = getTopNIntervals(getAllUserTimes(true), 5);

    	// console.log(topIntervals);
    	getTimes();

    	// Concepts incorporated: Rendering Times
    	let topTimesText = topTimesToText(topIntervals);

    	function topTimesToText(topIntervalsPromise) {
    		// console.log({topIntervalsPromise})
    		let topIntervals = topIntervalsPromise;

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
    	// function handleInput() {
    	// 	availableTimes = processText(text);
    	// };
    	function getTimes() {
    		currentEvent.set(location.href.split("/")[3]);
    		console.log($currentEvent);
    		let data;

    		if ($currentEvent in $storedData) {
    			data = $storedData[$currentEvent];
    		} else {
    			data = {};
    			storedData.set(Object.assign({}, { [$currentEvent]: {} }, $storedData));
    		}

    		console.log("whatup");
    		console.log($storedData);

    		// const data = db.read()
    		return data;
    	}

    	function postTimes(username, userTimes) {
    		console.log('in post times');
    		const strUserTimes = JSON.stringify(userTimes);

    		({
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({ name: username, times: strUserTimes })
    		});

    		const localData = { [username]: strUserTimes };

    		const localDataWithEvent = {
    			[$currentEvent]: Object.assign({}, $storedData[$currentEvent], localData)
    		};

    		console.log($currentEvent);
    		console.log(localData);
    		storedData.set(Object.assign({}, $storedData, localDataWithEvent));

    		// db.write(localData)
    		console.log(localDataWithEvent);

    		console.log($storedData);
    		return localData;
    	}

    	async function submit() {
    		if (name === '') {
    			alert('please include name!');
    		} else {
    			availableTimes = processText(text);
    			postTimes(name, availableTimes);
    			let userTimes = getAllUserTimes(true);
    			console.log("utimes");
    			console.log(userTimes);
    			$$invalidate(3, topTimesText = topTimesToText(getTopNIntervals(userTimes, 5)));
    			console.log("topn");
    			console.log(topTimesText);
    			currentUser.set(name);
    			$$invalidate(1, name = '');
    			$$invalidate(2, text = '');
    			document.getElementById("confirmation").value = '';
    			document.getElementById("presub").value = "Submit";
    			presubmitted = false;
    			editedAfterPresubmit = false;
    		}
    	}

    	// Concepts incorporated: User
    	function getAllUserTimes(allInfo = false) {
    		let userTimes = [];
    		let payload = getTimes();
    		console.log("payday");
    		console.log({ payload });

    		for (let i = 0; i < Object.keys(payload).length; i++) {
    			console.log(Object.keys(payload)[i]);

    			if (allInfo) {
    				userTimes.push({
    					name: Object.keys(payload)[i],
    					times: payload[Object.keys(payload)[i]]
    				});
    			} else {
    				userTimes.push(payload[Object.keys(payload)[i]]);
    			}
    		}
    		return userTimes;
    	}

    	async function presubmit() {
    		if (name === '') {
    			alert('please include name!');
    		} else {
    			presubmitted = true;
    			editedAfterPresubmit = false;
    			document.getElementById("presub").value = "Resubmit";
    			availableTimes = processText(text);
    			document.getElementById("confirmation").value = render(availableTimes);
    			document.getElementById("confirmation").style.backgroundColor = "white";
    			document.getElementById("edited").innerText = "";
    		}
    	}

    	function retro() {
    		console.log("retro called");
    		editedAfterPresubmit = true;

    		if (presubmitted && editedAfterPresubmit) {
    			console.log("retro really called");
    			document.getElementById("confirmation").style.backgroundColor = "#D3D3D3";
    			document.getElementById("edited").innerText = "Parse is no longer accurate because input has been edited since \"Submit\" was last pressed. To regenerate parsed times, press \"Submit\" again.";
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (eventID === undefined && !('eventID' in $$props || $$self.$$.bound[$$self.$$.props['eventID']])) {
    			console_1$1.warn("<InputTimes> was created without expected prop 'eventID'");
    		}
    	});

    	const writable_props = ['eventID'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<InputTimes> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => location.href = "/";

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	function voicerecognition_noteContent_binding(value) {
    		text = value;
    		$$invalidate(2, text);
    	}

    	function textarea0_input_handler() {
    		text = this.value;
    		$$invalidate(2, text);
    	}

    	$$self.$$set = $$props => {
    		if ('eventID' in $$props) $$invalidate(0, eventID = $$props.eventID);
    	};

    	$$self.$capture_state = () => ({
    		VoiceRecognition,
    		processText,
    		makeTimeArr,
    		getTopNIntervals,
    		Table,
    		storedData,
    		currentUser,
    		currentEvent,
    		dayArr,
    		eventID,
    		name,
    		text,
    		availableTimes,
    		API_BASE,
    		accessibleDate,
    		presubmitted,
    		editedAfterPresubmit,
    		topIntervals,
    		topTimesText,
    		topTimesToText,
    		getTimes,
    		postTimes,
    		submit,
    		getAllUserTimes,
    		presubmit,
    		render,
    		retro,
    		$storedData,
    		$currentEvent
    	});

    	$$self.$inject_state = $$props => {
    		if ('eventID' in $$props) $$invalidate(0, eventID = $$props.eventID);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    		if ('availableTimes' in $$props) availableTimes = $$props.availableTimes;
    		if ('API_BASE' in $$props) API_BASE = $$props.API_BASE;
    		if ('presubmitted' in $$props) presubmitted = $$props.presubmitted;
    		if ('editedAfterPresubmit' in $$props) editedAfterPresubmit = $$props.editedAfterPresubmit;
    		if ('topIntervals' in $$props) topIntervals = $$props.topIntervals;
    		if ('topTimesText' in $$props) $$invalidate(3, topTimesText = $$props.topTimesText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		eventID,
    		name,
    		text,
    		topTimesText,
    		dayArr,
    		submit,
    		presubmit,
    		retro,
    		click_handler,
    		input0_input_handler,
    		voicerecognition_noteContent_binding,
    		textarea0_input_handler
    	];
    }

    class InputTimes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { eventID: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputTimes",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get eventID() {
    		throw new Error("<InputTimes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eventID(value) {
    		throw new Error("<InputTimes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    var jqueryExports = {};
    var jquery = {
      get exports(){ return jqueryExports; },
      set exports(v){ jqueryExports = v; },
    };

    /*!
     * jQuery JavaScript Library v3.6.4
     * https://jquery.com/
     *
     * Includes Sizzle.js
     * https://sizzlejs.com/
     *
     * Copyright OpenJS Foundation and other contributors
     * Released under the MIT license
     * https://jquery.org/license
     *
     * Date: 2023-03-08T15:28Z
     */

    (function (module) {
    	( function( global, factory ) {

    		{

    			// For CommonJS and CommonJS-like environments where a proper `window`
    			// is present, execute the factory and get jQuery.
    			// For environments that do not have a `window` with a `document`
    			// (such as Node.js), expose a factory as module.exports.
    			// This accentuates the need for the creation of a real `window`.
    			// e.g. var jQuery = require("jquery")(window);
    			// See ticket trac-14549 for more info.
    			module.exports = global.document ?
    				factory( global, true ) :
    				function( w ) {
    					if ( !w.document ) {
    						throw new Error( "jQuery requires a window with a document" );
    					}
    					return factory( w );
    				};
    		}

    	// Pass this if window is not defined yet
    	} )( typeof window !== "undefined" ? window : commonjsGlobal, function( window, noGlobal ) {

    	var arr = [];

    	var getProto = Object.getPrototypeOf;

    	var slice = arr.slice;

    	var flat = arr.flat ? function( array ) {
    		return arr.flat.call( array );
    	} : function( array ) {
    		return arr.concat.apply( [], array );
    	};


    	var push = arr.push;

    	var indexOf = arr.indexOf;

    	var class2type = {};

    	var toString = class2type.toString;

    	var hasOwn = class2type.hasOwnProperty;

    	var fnToString = hasOwn.toString;

    	var ObjectFunctionString = fnToString.call( Object );

    	var support = {};

    	var isFunction = function isFunction( obj ) {

    			// Support: Chrome <=57, Firefox <=52
    			// In some browsers, typeof returns "function" for HTML <object> elements
    			// (i.e., `typeof document.createElement( "object" ) === "function"`).
    			// We don't want to classify *any* DOM node as a function.
    			// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
    			// Plus for old WebKit, typeof returns "function" for HTML collections
    			// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
    			return typeof obj === "function" && typeof obj.nodeType !== "number" &&
    				typeof obj.item !== "function";
    		};


    	var isWindow = function isWindow( obj ) {
    			return obj != null && obj === obj.window;
    		};


    	var document = window.document;



    		var preservedScriptAttributes = {
    			type: true,
    			src: true,
    			nonce: true,
    			noModule: true
    		};

    		function DOMEval( code, node, doc ) {
    			doc = doc || document;

    			var i, val,
    				script = doc.createElement( "script" );

    			script.text = code;
    			if ( node ) {
    				for ( i in preservedScriptAttributes ) {

    					// Support: Firefox 64+, Edge 18+
    					// Some browsers don't support the "nonce" property on scripts.
    					// On the other hand, just using `getAttribute` is not enough as
    					// the `nonce` attribute is reset to an empty string whenever it
    					// becomes browsing-context connected.
    					// See https://github.com/whatwg/html/issues/2369
    					// See https://html.spec.whatwg.org/#nonce-attributes
    					// The `node.getAttribute` check was added for the sake of
    					// `jQuery.globalEval` so that it can fake a nonce-containing node
    					// via an object.
    					val = node[ i ] || node.getAttribute && node.getAttribute( i );
    					if ( val ) {
    						script.setAttribute( i, val );
    					}
    				}
    			}
    			doc.head.appendChild( script ).parentNode.removeChild( script );
    		}


    	function toType( obj ) {
    		if ( obj == null ) {
    			return obj + "";
    		}

    		// Support: Android <=2.3 only (functionish RegExp)
    		return typeof obj === "object" || typeof obj === "function" ?
    			class2type[ toString.call( obj ) ] || "object" :
    			typeof obj;
    	}
    	/* global Symbol */
    	// Defining this global in .eslintrc.json would create a danger of using the global
    	// unguarded in another place, it seems safer to define global only for this module



    	var
    		version = "3.6.4",

    		// Define a local copy of jQuery
    		jQuery = function( selector, context ) {

    			// The jQuery object is actually just the init constructor 'enhanced'
    			// Need init if jQuery is called (just allow error to be thrown if not included)
    			return new jQuery.fn.init( selector, context );
    		};

    	jQuery.fn = jQuery.prototype = {

    		// The current version of jQuery being used
    		jquery: version,

    		constructor: jQuery,

    		// The default length of a jQuery object is 0
    		length: 0,

    		toArray: function() {
    			return slice.call( this );
    		},

    		// Get the Nth element in the matched element set OR
    		// Get the whole matched element set as a clean array
    		get: function( num ) {

    			// Return all the elements in a clean array
    			if ( num == null ) {
    				return slice.call( this );
    			}

    			// Return just the one element from the set
    			return num < 0 ? this[ num + this.length ] : this[ num ];
    		},

    		// Take an array of elements and push it onto the stack
    		// (returning the new matched element set)
    		pushStack: function( elems ) {

    			// Build a new jQuery matched element set
    			var ret = jQuery.merge( this.constructor(), elems );

    			// Add the old object onto the stack (as a reference)
    			ret.prevObject = this;

    			// Return the newly-formed element set
    			return ret;
    		},

    		// Execute a callback for every element in the matched set.
    		each: function( callback ) {
    			return jQuery.each( this, callback );
    		},

    		map: function( callback ) {
    			return this.pushStack( jQuery.map( this, function( elem, i ) {
    				return callback.call( elem, i, elem );
    			} ) );
    		},

    		slice: function() {
    			return this.pushStack( slice.apply( this, arguments ) );
    		},

    		first: function() {
    			return this.eq( 0 );
    		},

    		last: function() {
    			return this.eq( -1 );
    		},

    		even: function() {
    			return this.pushStack( jQuery.grep( this, function( _elem, i ) {
    				return ( i + 1 ) % 2;
    			} ) );
    		},

    		odd: function() {
    			return this.pushStack( jQuery.grep( this, function( _elem, i ) {
    				return i % 2;
    			} ) );
    		},

    		eq: function( i ) {
    			var len = this.length,
    				j = +i + ( i < 0 ? len : 0 );
    			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
    		},

    		end: function() {
    			return this.prevObject || this.constructor();
    		},

    		// For internal use only.
    		// Behaves like an Array's method, not like a jQuery method.
    		push: push,
    		sort: arr.sort,
    		splice: arr.splice
    	};

    	jQuery.extend = jQuery.fn.extend = function() {
    		var options, name, src, copy, copyIsArray, clone,
    			target = arguments[ 0 ] || {},
    			i = 1,
    			length = arguments.length,
    			deep = false;

    		// Handle a deep copy situation
    		if ( typeof target === "boolean" ) {
    			deep = target;

    			// Skip the boolean and the target
    			target = arguments[ i ] || {};
    			i++;
    		}

    		// Handle case when target is a string or something (possible in deep copy)
    		if ( typeof target !== "object" && !isFunction( target ) ) {
    			target = {};
    		}

    		// Extend jQuery itself if only one argument is passed
    		if ( i === length ) {
    			target = this;
    			i--;
    		}

    		for ( ; i < length; i++ ) {

    			// Only deal with non-null/undefined values
    			if ( ( options = arguments[ i ] ) != null ) {

    				// Extend the base object
    				for ( name in options ) {
    					copy = options[ name ];

    					// Prevent Object.prototype pollution
    					// Prevent never-ending loop
    					if ( name === "__proto__" || target === copy ) {
    						continue;
    					}

    					// Recurse if we're merging plain objects or arrays
    					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
    						( copyIsArray = Array.isArray( copy ) ) ) ) {
    						src = target[ name ];

    						// Ensure proper type for the source value
    						if ( copyIsArray && !Array.isArray( src ) ) {
    							clone = [];
    						} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
    							clone = {};
    						} else {
    							clone = src;
    						}
    						copyIsArray = false;

    						// Never move original objects, clone them
    						target[ name ] = jQuery.extend( deep, clone, copy );

    					// Don't bring in undefined values
    					} else if ( copy !== undefined ) {
    						target[ name ] = copy;
    					}
    				}
    			}
    		}

    		// Return the modified object
    		return target;
    	};

    	jQuery.extend( {

    		// Unique for each copy of jQuery on the page
    		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

    		// Assume jQuery is ready without the ready module
    		isReady: true,

    		error: function( msg ) {
    			throw new Error( msg );
    		},

    		noop: function() {},

    		isPlainObject: function( obj ) {
    			var proto, Ctor;

    			// Detect obvious negatives
    			// Use toString instead of jQuery.type to catch host objects
    			if ( !obj || toString.call( obj ) !== "[object Object]" ) {
    				return false;
    			}

    			proto = getProto( obj );

    			// Objects with no prototype (e.g., `Object.create( null )`) are plain
    			if ( !proto ) {
    				return true;
    			}

    			// Objects with prototype are plain iff they were constructed by a global Object function
    			Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
    			return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
    		},

    		isEmptyObject: function( obj ) {
    			var name;

    			for ( name in obj ) {
    				return false;
    			}
    			return true;
    		},

    		// Evaluates a script in a provided context; falls back to the global one
    		// if not specified.
    		globalEval: function( code, options, doc ) {
    			DOMEval( code, { nonce: options && options.nonce }, doc );
    		},

    		each: function( obj, callback ) {
    			var length, i = 0;

    			if ( isArrayLike( obj ) ) {
    				length = obj.length;
    				for ( ; i < length; i++ ) {
    					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
    						break;
    					}
    				}
    			} else {
    				for ( i in obj ) {
    					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
    						break;
    					}
    				}
    			}

    			return obj;
    		},

    		// results is for internal usage only
    		makeArray: function( arr, results ) {
    			var ret = results || [];

    			if ( arr != null ) {
    				if ( isArrayLike( Object( arr ) ) ) {
    					jQuery.merge( ret,
    						typeof arr === "string" ?
    							[ arr ] : arr
    					);
    				} else {
    					push.call( ret, arr );
    				}
    			}

    			return ret;
    		},

    		inArray: function( elem, arr, i ) {
    			return arr == null ? -1 : indexOf.call( arr, elem, i );
    		},

    		// Support: Android <=4.0 only, PhantomJS 1 only
    		// push.apply(_, arraylike) throws on ancient WebKit
    		merge: function( first, second ) {
    			var len = +second.length,
    				j = 0,
    				i = first.length;

    			for ( ; j < len; j++ ) {
    				first[ i++ ] = second[ j ];
    			}

    			first.length = i;

    			return first;
    		},

    		grep: function( elems, callback, invert ) {
    			var callbackInverse,
    				matches = [],
    				i = 0,
    				length = elems.length,
    				callbackExpect = !invert;

    			// Go through the array, only saving the items
    			// that pass the validator function
    			for ( ; i < length; i++ ) {
    				callbackInverse = !callback( elems[ i ], i );
    				if ( callbackInverse !== callbackExpect ) {
    					matches.push( elems[ i ] );
    				}
    			}

    			return matches;
    		},

    		// arg is for internal usage only
    		map: function( elems, callback, arg ) {
    			var length, value,
    				i = 0,
    				ret = [];

    			// Go through the array, translating each of the items to their new values
    			if ( isArrayLike( elems ) ) {
    				length = elems.length;
    				for ( ; i < length; i++ ) {
    					value = callback( elems[ i ], i, arg );

    					if ( value != null ) {
    						ret.push( value );
    					}
    				}

    			// Go through every key on the object,
    			} else {
    				for ( i in elems ) {
    					value = callback( elems[ i ], i, arg );

    					if ( value != null ) {
    						ret.push( value );
    					}
    				}
    			}

    			// Flatten any nested arrays
    			return flat( ret );
    		},

    		// A global GUID counter for objects
    		guid: 1,

    		// jQuery.support is not used in Core but other projects attach their
    		// properties to it so it needs to exist.
    		support: support
    	} );

    	if ( typeof Symbol === "function" ) {
    		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
    	}

    	// Populate the class2type map
    	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
    		function( _i, name ) {
    			class2type[ "[object " + name + "]" ] = name.toLowerCase();
    		} );

    	function isArrayLike( obj ) {

    		// Support: real iOS 8.2 only (not reproducible in simulator)
    		// `in` check used to prevent JIT error (gh-2145)
    		// hasOwn isn't used here due to false negatives
    		// regarding Nodelist length in IE
    		var length = !!obj && "length" in obj && obj.length,
    			type = toType( obj );

    		if ( isFunction( obj ) || isWindow( obj ) ) {
    			return false;
    		}

    		return type === "array" || length === 0 ||
    			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    	}
    	var Sizzle =
    	/*!
    	 * Sizzle CSS Selector Engine v2.3.10
    	 * https://sizzlejs.com/
    	 *
    	 * Copyright JS Foundation and other contributors
    	 * Released under the MIT license
    	 * https://js.foundation/
    	 *
    	 * Date: 2023-02-14
    	 */
    	( function( window ) {
    	var i,
    		support,
    		Expr,
    		getText,
    		isXML,
    		tokenize,
    		compile,
    		select,
    		outermostContext,
    		sortInput,
    		hasDuplicate,

    		// Local document vars
    		setDocument,
    		document,
    		docElem,
    		documentIsHTML,
    		rbuggyQSA,
    		rbuggyMatches,
    		matches,
    		contains,

    		// Instance-specific data
    		expando = "sizzle" + 1 * new Date(),
    		preferredDoc = window.document,
    		dirruns = 0,
    		done = 0,
    		classCache = createCache(),
    		tokenCache = createCache(),
    		compilerCache = createCache(),
    		nonnativeSelectorCache = createCache(),
    		sortOrder = function( a, b ) {
    			if ( a === b ) {
    				hasDuplicate = true;
    			}
    			return 0;
    		},

    		// Instance methods
    		hasOwn = ( {} ).hasOwnProperty,
    		arr = [],
    		pop = arr.pop,
    		pushNative = arr.push,
    		push = arr.push,
    		slice = arr.slice,

    		// Use a stripped-down indexOf as it's faster than native
    		// https://jsperf.com/thor-indexof-vs-for/5
    		indexOf = function( list, elem ) {
    			var i = 0,
    				len = list.length;
    			for ( ; i < len; i++ ) {
    				if ( list[ i ] === elem ) {
    					return i;
    				}
    			}
    			return -1;
    		},

    		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
    			"ismap|loop|multiple|open|readonly|required|scoped",

    		// Regular expressions

    		// http://www.w3.org/TR/css3-selectors/#whitespace
    		whitespace = "[\\x20\\t\\r\\n\\f]",

    		// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
    		identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
    			"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

    		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
    		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

    			// Operator (capture 2)
    			"*([*^$|!~]?=)" + whitespace +

    			// "Attribute values must be CSS identifiers [capture 5]
    			// or strings [capture 3 or capture 4]"
    			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
    			whitespace + "*\\]",

    		pseudos = ":(" + identifier + ")(?:\\((" +

    			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
    			// 1. quoted (capture 3; capture 4 or capture 5)
    			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

    			// 2. simple (capture 6)
    			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

    			// 3. anything else (capture 2)
    			".*" +
    			")\\)|)",

    		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    		rwhitespace = new RegExp( whitespace + "+", "g" ),
    		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
    			whitespace + "+$", "g" ),

    		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
    		rleadingCombinator = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
    			"*" ),
    		rdescend = new RegExp( whitespace + "|>" ),

    		rpseudo = new RegExp( pseudos ),
    		ridentifier = new RegExp( "^" + identifier + "$" ),

    		matchExpr = {
    			"ID": new RegExp( "^#(" + identifier + ")" ),
    			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
    			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
    			"ATTR": new RegExp( "^" + attributes ),
    			"PSEUDO": new RegExp( "^" + pseudos ),
    			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
    				whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
    				whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
    			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

    			// For use in libraries implementing .is()
    			// We use this for POS matching in `select`
    			"needsContext": new RegExp( "^" + whitespace +
    				"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
    				"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
    		},

    		rhtml = /HTML$/i,
    		rinputs = /^(?:input|select|textarea|button)$/i,
    		rheader = /^h\d$/i,

    		rnative = /^[^{]+\{\s*\[native \w/,

    		// Easily-parseable/retrievable ID or TAG or CLASS selectors
    		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

    		rsibling = /[+~]/,

    		// CSS escapes
    		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    		runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
    		funescape = function( escape, nonHex ) {
    			var high = "0x" + escape.slice( 1 ) - 0x10000;

    			return nonHex ?

    				// Strip the backslash prefix from a non-hex escape sequence
    				nonHex :

    				// Replace a hexadecimal escape sequence with the encoded Unicode code point
    				// Support: IE <=11+
    				// For values outside the Basic Multilingual Plane (BMP), manually construct a
    				// surrogate pair
    				high < 0 ?
    					String.fromCharCode( high + 0x10000 ) :
    					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    		},

    		// CSS string/identifier serialization
    		// https://drafts.csswg.org/cssom/#common-serializing-idioms
    		rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
    		fcssescape = function( ch, asCodePoint ) {
    			if ( asCodePoint ) {

    				// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
    				if ( ch === "\0" ) {
    					return "\uFFFD";
    				}

    				// Control characters and (dependent upon position) numbers get escaped as code points
    				return ch.slice( 0, -1 ) + "\\" +
    					ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
    			}

    			// Other potentially-special ASCII characters get backslash-escaped
    			return "\\" + ch;
    		},

    		// Used for iframes
    		// See setDocument()
    		// Removing the function wrapper causes a "Permission Denied"
    		// error in IE
    		unloadHandler = function() {
    			setDocument();
    		},

    		inDisabledFieldset = addCombinator(
    			function( elem ) {
    				return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
    			},
    			{ dir: "parentNode", next: "legend" }
    		);

    	// Optimize for push.apply( _, NodeList )
    	try {
    		push.apply(
    			( arr = slice.call( preferredDoc.childNodes ) ),
    			preferredDoc.childNodes
    		);

    		// Support: Android<4.0
    		// Detect silently failing push.apply
    		// eslint-disable-next-line no-unused-expressions
    		arr[ preferredDoc.childNodes.length ].nodeType;
    	} catch ( e ) {
    		push = { apply: arr.length ?

    			// Leverage slice if possible
    			function( target, els ) {
    				pushNative.apply( target, slice.call( els ) );
    			} :

    			// Support: IE<9
    			// Otherwise append directly
    			function( target, els ) {
    				var j = target.length,
    					i = 0;

    				// Can't trust NodeList.length
    				while ( ( target[ j++ ] = els[ i++ ] ) ) {}
    				target.length = j - 1;
    			}
    		};
    	}

    	function Sizzle( selector, context, results, seed ) {
    		var m, i, elem, nid, match, groups, newSelector,
    			newContext = context && context.ownerDocument,

    			// nodeType defaults to 9, since context defaults to document
    			nodeType = context ? context.nodeType : 9;

    		results = results || [];

    		// Return early from calls with invalid selector or context
    		if ( typeof selector !== "string" || !selector ||
    			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

    			return results;
    		}

    		// Try to shortcut find operations (as opposed to filters) in HTML documents
    		if ( !seed ) {
    			setDocument( context );
    			context = context || document;

    			if ( documentIsHTML ) {

    				// If the selector is sufficiently simple, try using a "get*By*" DOM method
    				// (excepting DocumentFragment context, where the methods don't exist)
    				if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

    					// ID selector
    					if ( ( m = match[ 1 ] ) ) {

    						// Document context
    						if ( nodeType === 9 ) {
    							if ( ( elem = context.getElementById( m ) ) ) {

    								// Support: IE, Opera, Webkit
    								// TODO: identify versions
    								// getElementById can match elements by name instead of ID
    								if ( elem.id === m ) {
    									results.push( elem );
    									return results;
    								}
    							} else {
    								return results;
    							}

    						// Element context
    						} else {

    							// Support: IE, Opera, Webkit
    							// TODO: identify versions
    							// getElementById can match elements by name instead of ID
    							if ( newContext && ( elem = newContext.getElementById( m ) ) &&
    								contains( context, elem ) &&
    								elem.id === m ) {

    								results.push( elem );
    								return results;
    							}
    						}

    					// Type selector
    					} else if ( match[ 2 ] ) {
    						push.apply( results, context.getElementsByTagName( selector ) );
    						return results;

    					// Class selector
    					} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
    						context.getElementsByClassName ) {

    						push.apply( results, context.getElementsByClassName( m ) );
    						return results;
    					}
    				}

    				// Take advantage of querySelectorAll
    				if ( support.qsa &&
    					!nonnativeSelectorCache[ selector + " " ] &&
    					( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

    					// Support: IE 8 only
    					// Exclude object elements
    					( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

    					newSelector = selector;
    					newContext = context;

    					// qSA considers elements outside a scoping root when evaluating child or
    					// descendant combinators, which is not what we want.
    					// In such cases, we work around the behavior by prefixing every selector in the
    					// list with an ID selector referencing the scope context.
    					// The technique has to be used as well when a leading combinator is used
    					// as such selectors are not recognized by querySelectorAll.
    					// Thanks to Andrew Dupont for this technique.
    					if ( nodeType === 1 &&
    						( rdescend.test( selector ) || rleadingCombinator.test( selector ) ) ) {

    						// Expand context for sibling selectors
    						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
    							context;

    						// We can use :scope instead of the ID hack if the browser
    						// supports it & if we're not changing the context.
    						if ( newContext !== context || !support.scope ) {

    							// Capture the context ID, setting it first if necessary
    							if ( ( nid = context.getAttribute( "id" ) ) ) {
    								nid = nid.replace( rcssescape, fcssescape );
    							} else {
    								context.setAttribute( "id", ( nid = expando ) );
    							}
    						}

    						// Prefix every selector in the list
    						groups = tokenize( selector );
    						i = groups.length;
    						while ( i-- ) {
    							groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
    								toSelector( groups[ i ] );
    						}
    						newSelector = groups.join( "," );
    					}

    					try {
    						push.apply( results,
    							newContext.querySelectorAll( newSelector )
    						);
    						return results;
    					} catch ( qsaError ) {
    						nonnativeSelectorCache( selector, true );
    					} finally {
    						if ( nid === expando ) {
    							context.removeAttribute( "id" );
    						}
    					}
    				}
    			}
    		}

    		// All others
    		return select( selector.replace( rtrim, "$1" ), context, results, seed );
    	}

    	/**
    	 * Create key-value caches of limited size
    	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
    	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
    	 *	deleting the oldest entry
    	 */
    	function createCache() {
    		var keys = [];

    		function cache( key, value ) {

    			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
    			if ( keys.push( key + " " ) > Expr.cacheLength ) {

    				// Only keep the most recent entries
    				delete cache[ keys.shift() ];
    			}
    			return ( cache[ key + " " ] = value );
    		}
    		return cache;
    	}

    	/**
    	 * Mark a function for special use by Sizzle
    	 * @param {Function} fn The function to mark
    	 */
    	function markFunction( fn ) {
    		fn[ expando ] = true;
    		return fn;
    	}

    	/**
    	 * Support testing using an element
    	 * @param {Function} fn Passed the created element and returns a boolean result
    	 */
    	function assert( fn ) {
    		var el = document.createElement( "fieldset" );

    		try {
    			return !!fn( el );
    		} catch ( e ) {
    			return false;
    		} finally {

    			// Remove from its parent by default
    			if ( el.parentNode ) {
    				el.parentNode.removeChild( el );
    			}

    			// release memory in IE
    			el = null;
    		}
    	}

    	/**
    	 * Adds the same handler for all of the specified attrs
    	 * @param {String} attrs Pipe-separated list of attributes
    	 * @param {Function} handler The method that will be applied
    	 */
    	function addHandle( attrs, handler ) {
    		var arr = attrs.split( "|" ),
    			i = arr.length;

    		while ( i-- ) {
    			Expr.attrHandle[ arr[ i ] ] = handler;
    		}
    	}

    	/**
    	 * Checks document order of two siblings
    	 * @param {Element} a
    	 * @param {Element} b
    	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
    	 */
    	function siblingCheck( a, b ) {
    		var cur = b && a,
    			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
    				a.sourceIndex - b.sourceIndex;

    		// Use IE sourceIndex if available on both nodes
    		if ( diff ) {
    			return diff;
    		}

    		// Check if b follows a
    		if ( cur ) {
    			while ( ( cur = cur.nextSibling ) ) {
    				if ( cur === b ) {
    					return -1;
    				}
    			}
    		}

    		return a ? 1 : -1;
    	}

    	/**
    	 * Returns a function to use in pseudos for input types
    	 * @param {String} type
    	 */
    	function createInputPseudo( type ) {
    		return function( elem ) {
    			var name = elem.nodeName.toLowerCase();
    			return name === "input" && elem.type === type;
    		};
    	}

    	/**
    	 * Returns a function to use in pseudos for buttons
    	 * @param {String} type
    	 */
    	function createButtonPseudo( type ) {
    		return function( elem ) {
    			var name = elem.nodeName.toLowerCase();
    			return ( name === "input" || name === "button" ) && elem.type === type;
    		};
    	}

    	/**
    	 * Returns a function to use in pseudos for :enabled/:disabled
    	 * @param {Boolean} disabled true for :disabled; false for :enabled
    	 */
    	function createDisabledPseudo( disabled ) {

    		// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
    		return function( elem ) {

    			// Only certain elements can match :enabled or :disabled
    			// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
    			// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
    			if ( "form" in elem ) {

    				// Check for inherited disabledness on relevant non-disabled elements:
    				// * listed form-associated elements in a disabled fieldset
    				//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
    				//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
    				// * option elements in a disabled optgroup
    				//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
    				// All such elements have a "form" property.
    				if ( elem.parentNode && elem.disabled === false ) {

    					// Option elements defer to a parent optgroup if present
    					if ( "label" in elem ) {
    						if ( "label" in elem.parentNode ) {
    							return elem.parentNode.disabled === disabled;
    						} else {
    							return elem.disabled === disabled;
    						}
    					}

    					// Support: IE 6 - 11
    					// Use the isDisabled shortcut property to check for disabled fieldset ancestors
    					return elem.isDisabled === disabled ||

    						// Where there is no isDisabled, check manually
    						/* jshint -W018 */
    						elem.isDisabled !== !disabled &&
    						inDisabledFieldset( elem ) === disabled;
    				}

    				return elem.disabled === disabled;

    			// Try to winnow out elements that can't be disabled before trusting the disabled property.
    			// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
    			// even exist on them, let alone have a boolean value.
    			} else if ( "label" in elem ) {
    				return elem.disabled === disabled;
    			}

    			// Remaining elements are neither :enabled nor :disabled
    			return false;
    		};
    	}

    	/**
    	 * Returns a function to use in pseudos for positionals
    	 * @param {Function} fn
    	 */
    	function createPositionalPseudo( fn ) {
    		return markFunction( function( argument ) {
    			argument = +argument;
    			return markFunction( function( seed, matches ) {
    				var j,
    					matchIndexes = fn( [], seed.length, argument ),
    					i = matchIndexes.length;

    				// Match elements found at the specified indexes
    				while ( i-- ) {
    					if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
    						seed[ j ] = !( matches[ j ] = seed[ j ] );
    					}
    				}
    			} );
    		} );
    	}

    	/**
    	 * Checks a node for validity as a Sizzle context
    	 * @param {Element|Object=} context
    	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
    	 */
    	function testContext( context ) {
    		return context && typeof context.getElementsByTagName !== "undefined" && context;
    	}

    	// Expose support vars for convenience
    	support = Sizzle.support = {};

    	/**
    	 * Detects XML nodes
    	 * @param {Element|Object} elem An element or a document
    	 * @returns {Boolean} True iff elem is a non-HTML XML node
    	 */
    	isXML = Sizzle.isXML = function( elem ) {
    		var namespace = elem && elem.namespaceURI,
    			docElem = elem && ( elem.ownerDocument || elem ).documentElement;

    		// Support: IE <=8
    		// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
    		// https://bugs.jquery.com/ticket/4833
    		return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
    	};

    	/**
    	 * Sets document-related variables once based on the current document
    	 * @param {Element|Object} [doc] An element or document object to use to set the document
    	 * @returns {Object} Returns the current document
    	 */
    	setDocument = Sizzle.setDocument = function( node ) {
    		var hasCompare, subWindow,
    			doc = node ? node.ownerDocument || node : preferredDoc;

    		// Return early if doc is invalid or already selected
    		// Support: IE 11+, Edge 17 - 18+
    		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    		// two documents; shallow comparisons work.
    		// eslint-disable-next-line eqeqeq
    		if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
    			return document;
    		}

    		// Update global variables
    		document = doc;
    		docElem = document.documentElement;
    		documentIsHTML = !isXML( document );

    		// Support: IE 9 - 11+, Edge 12 - 18+
    		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
    		// Support: IE 11+, Edge 17 - 18+
    		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    		// two documents; shallow comparisons work.
    		// eslint-disable-next-line eqeqeq
    		if ( preferredDoc != document &&
    			( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

    			// Support: IE 11, Edge
    			if ( subWindow.addEventListener ) {
    				subWindow.addEventListener( "unload", unloadHandler, false );

    			// Support: IE 9 - 10 only
    			} else if ( subWindow.attachEvent ) {
    				subWindow.attachEvent( "onunload", unloadHandler );
    			}
    		}

    		// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
    		// Safari 4 - 5 only, Opera <=11.6 - 12.x only
    		// IE/Edge & older browsers don't support the :scope pseudo-class.
    		// Support: Safari 6.0 only
    		// Safari 6.0 supports :scope but it's an alias of :root there.
    		support.scope = assert( function( el ) {
    			docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
    			return typeof el.querySelectorAll !== "undefined" &&
    				!el.querySelectorAll( ":scope fieldset div" ).length;
    		} );

    		// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
    		// Make sure the the `:has()` argument is parsed unforgivingly.
    		// We include `*` in the test to detect buggy implementations that are
    		// _selectively_ forgiving (specifically when the list includes at least
    		// one valid selector).
    		// Note that we treat complete lack of support for `:has()` as if it were
    		// spec-compliant support, which is fine because use of `:has()` in such
    		// environments will fail in the qSA path and fall back to jQuery traversal
    		// anyway.
    		support.cssHas = assert( function() {
    			try {
    				document.querySelector( ":has(*,:jqfake)" );
    				return false;
    			} catch ( e ) {
    				return true;
    			}
    		} );

    		/* Attributes
    		---------------------------------------------------------------------- */

    		// Support: IE<8
    		// Verify that getAttribute really returns attributes and not properties
    		// (excepting IE8 booleans)
    		support.attributes = assert( function( el ) {
    			el.className = "i";
    			return !el.getAttribute( "className" );
    		} );

    		/* getElement(s)By*
    		---------------------------------------------------------------------- */

    		// Check if getElementsByTagName("*") returns only elements
    		support.getElementsByTagName = assert( function( el ) {
    			el.appendChild( document.createComment( "" ) );
    			return !el.getElementsByTagName( "*" ).length;
    		} );

    		// Support: IE<9
    		support.getElementsByClassName = rnative.test( document.getElementsByClassName );

    		// Support: IE<10
    		// Check if getElementById returns elements by name
    		// The broken getElementById methods don't pick up programmatically-set names,
    		// so use a roundabout getElementsByName test
    		support.getById = assert( function( el ) {
    			docElem.appendChild( el ).id = expando;
    			return !document.getElementsByName || !document.getElementsByName( expando ).length;
    		} );

    		// ID filter and find
    		if ( support.getById ) {
    			Expr.filter[ "ID" ] = function( id ) {
    				var attrId = id.replace( runescape, funescape );
    				return function( elem ) {
    					return elem.getAttribute( "id" ) === attrId;
    				};
    			};
    			Expr.find[ "ID" ] = function( id, context ) {
    				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
    					var elem = context.getElementById( id );
    					return elem ? [ elem ] : [];
    				}
    			};
    		} else {
    			Expr.filter[ "ID" ] =  function( id ) {
    				var attrId = id.replace( runescape, funescape );
    				return function( elem ) {
    					var node = typeof elem.getAttributeNode !== "undefined" &&
    						elem.getAttributeNode( "id" );
    					return node && node.value === attrId;
    				};
    			};

    			// Support: IE 6 - 7 only
    			// getElementById is not reliable as a find shortcut
    			Expr.find[ "ID" ] = function( id, context ) {
    				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
    					var node, i, elems,
    						elem = context.getElementById( id );

    					if ( elem ) {

    						// Verify the id attribute
    						node = elem.getAttributeNode( "id" );
    						if ( node && node.value === id ) {
    							return [ elem ];
    						}

    						// Fall back on getElementsByName
    						elems = context.getElementsByName( id );
    						i = 0;
    						while ( ( elem = elems[ i++ ] ) ) {
    							node = elem.getAttributeNode( "id" );
    							if ( node && node.value === id ) {
    								return [ elem ];
    							}
    						}
    					}

    					return [];
    				}
    			};
    		}

    		// Tag
    		Expr.find[ "TAG" ] = support.getElementsByTagName ?
    			function( tag, context ) {
    				if ( typeof context.getElementsByTagName !== "undefined" ) {
    					return context.getElementsByTagName( tag );

    				// DocumentFragment nodes don't have gEBTN
    				} else if ( support.qsa ) {
    					return context.querySelectorAll( tag );
    				}
    			} :

    			function( tag, context ) {
    				var elem,
    					tmp = [],
    					i = 0,

    					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
    					results = context.getElementsByTagName( tag );

    				// Filter out possible comments
    				if ( tag === "*" ) {
    					while ( ( elem = results[ i++ ] ) ) {
    						if ( elem.nodeType === 1 ) {
    							tmp.push( elem );
    						}
    					}

    					return tmp;
    				}
    				return results;
    			};

    		// Class
    		Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
    			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
    				return context.getElementsByClassName( className );
    			}
    		};

    		/* QSA/matchesSelector
    		---------------------------------------------------------------------- */

    		// QSA and matchesSelector support

    		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
    		rbuggyMatches = [];

    		// qSa(:focus) reports false when true (Chrome 21)
    		// We allow this because of a bug in IE8/9 that throws an error
    		// whenever `document.activeElement` is accessed on an iframe
    		// So, we allow :focus to pass through QSA all the time to avoid the IE error
    		// See https://bugs.jquery.com/ticket/13378
    		rbuggyQSA = [];

    		if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

    			// Build QSA regex
    			// Regex strategy adopted from Diego Perini
    			assert( function( el ) {

    				var input;

    				// Select is set to empty string on purpose
    				// This is to test IE's treatment of not explicitly
    				// setting a boolean content attribute,
    				// since its presence should be enough
    				// https://bugs.jquery.com/ticket/12359
    				docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
    					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
    					"<option selected=''></option></select>";

    				// Support: IE8, Opera 11-12.16
    				// Nothing should be selected when empty strings follow ^= or $= or *=
    				// The test attribute must be unknown in Opera but "safe" for WinRT
    				// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
    				if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
    					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
    				}

    				// Support: IE8
    				// Boolean attributes and "value" are not treated correctly
    				if ( !el.querySelectorAll( "[selected]" ).length ) {
    					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
    				}

    				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
    				if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
    					rbuggyQSA.push( "~=" );
    				}

    				// Support: IE 11+, Edge 15 - 18+
    				// IE 11/Edge don't find elements on a `[name='']` query in some cases.
    				// Adding a temporary attribute to the document before the selection works
    				// around the issue.
    				// Interestingly, IE 10 & older don't seem to have the issue.
    				input = document.createElement( "input" );
    				input.setAttribute( "name", "" );
    				el.appendChild( input );
    				if ( !el.querySelectorAll( "[name='']" ).length ) {
    					rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
    						whitespace + "*(?:''|\"\")" );
    				}

    				// Webkit/Opera - :checked should return selected option elements
    				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
    				// IE8 throws error here and will not see later tests
    				if ( !el.querySelectorAll( ":checked" ).length ) {
    					rbuggyQSA.push( ":checked" );
    				}

    				// Support: Safari 8+, iOS 8+
    				// https://bugs.webkit.org/show_bug.cgi?id=136851
    				// In-page `selector#id sibling-combinator selector` fails
    				if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
    					rbuggyQSA.push( ".#.+[+~]" );
    				}

    				// Support: Firefox <=3.6 - 5 only
    				// Old Firefox doesn't throw on a badly-escaped identifier.
    				el.querySelectorAll( "\\\f" );
    				rbuggyQSA.push( "[\\r\\n\\f]" );
    			} );

    			assert( function( el ) {
    				el.innerHTML = "<a href='' disabled='disabled'></a>" +
    					"<select disabled='disabled'><option/></select>";

    				// Support: Windows 8 Native Apps
    				// The type and name attributes are restricted during .innerHTML assignment
    				var input = document.createElement( "input" );
    				input.setAttribute( "type", "hidden" );
    				el.appendChild( input ).setAttribute( "name", "D" );

    				// Support: IE8
    				// Enforce case-sensitivity of name attribute
    				if ( el.querySelectorAll( "[name=d]" ).length ) {
    					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
    				}

    				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
    				// IE8 throws error here and will not see later tests
    				if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
    					rbuggyQSA.push( ":enabled", ":disabled" );
    				}

    				// Support: IE9-11+
    				// IE's :disabled selector does not pick up the children of disabled fieldsets
    				docElem.appendChild( el ).disabled = true;
    				if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
    					rbuggyQSA.push( ":enabled", ":disabled" );
    				}

    				// Support: Opera 10 - 11 only
    				// Opera 10-11 does not throw on post-comma invalid pseudos
    				el.querySelectorAll( "*,:x" );
    				rbuggyQSA.push( ",.*:" );
    			} );
    		}

    		if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
    			docElem.webkitMatchesSelector ||
    			docElem.mozMatchesSelector ||
    			docElem.oMatchesSelector ||
    			docElem.msMatchesSelector ) ) ) ) {

    			assert( function( el ) {

    				// Check to see if it's possible to do matchesSelector
    				// on a disconnected node (IE 9)
    				support.disconnectedMatch = matches.call( el, "*" );

    				// This should fail with an exception
    				// Gecko does not error, returns false instead
    				matches.call( el, "[s!='']:x" );
    				rbuggyMatches.push( "!=", pseudos );
    			} );
    		}

    		if ( !support.cssHas ) {

    			// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
    			// Our regular `try-catch` mechanism fails to detect natively-unsupported
    			// pseudo-classes inside `:has()` (such as `:has(:contains("Foo"))`)
    			// in browsers that parse the `:has()` argument as a forgiving selector list.
    			// https://drafts.csswg.org/selectors/#relational now requires the argument
    			// to be parsed unforgivingly, but browsers have not yet fully adjusted.
    			rbuggyQSA.push( ":has" );
    		}

    		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
    		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

    		/* Contains
    		---------------------------------------------------------------------- */
    		hasCompare = rnative.test( docElem.compareDocumentPosition );

    		// Element contains another
    		// Purposefully self-exclusive
    		// As in, an element does not contain itself
    		contains = hasCompare || rnative.test( docElem.contains ) ?
    			function( a, b ) {

    				// Support: IE <9 only
    				// IE doesn't have `contains` on `document` so we need to check for
    				// `documentElement` presence.
    				// We need to fall back to `a` when `documentElement` is missing
    				// as `ownerDocument` of elements within `<template/>` may have
    				// a null one - a default behavior of all modern browsers.
    				var adown = a.nodeType === 9 && a.documentElement || a,
    					bup = b && b.parentNode;
    				return a === bup || !!( bup && bup.nodeType === 1 && (
    					adown.contains ?
    						adown.contains( bup ) :
    						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
    				) );
    			} :
    			function( a, b ) {
    				if ( b ) {
    					while ( ( b = b.parentNode ) ) {
    						if ( b === a ) {
    							return true;
    						}
    					}
    				}
    				return false;
    			};

    		/* Sorting
    		---------------------------------------------------------------------- */

    		// Document order sorting
    		sortOrder = hasCompare ?
    		function( a, b ) {

    			// Flag for duplicate removal
    			if ( a === b ) {
    				hasDuplicate = true;
    				return 0;
    			}

    			// Sort on method existence if only one input has compareDocumentPosition
    			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
    			if ( compare ) {
    				return compare;
    			}

    			// Calculate position if both inputs belong to the same document
    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			// eslint-disable-next-line eqeqeq
    			compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
    				a.compareDocumentPosition( b ) :

    				// Otherwise we know they are disconnected
    				1;

    			// Disconnected nodes
    			if ( compare & 1 ||
    				( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

    				// Choose the first element that is related to our preferred document
    				// Support: IE 11+, Edge 17 - 18+
    				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    				// two documents; shallow comparisons work.
    				// eslint-disable-next-line eqeqeq
    				if ( a == document || a.ownerDocument == preferredDoc &&
    					contains( preferredDoc, a ) ) {
    					return -1;
    				}

    				// Support: IE 11+, Edge 17 - 18+
    				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    				// two documents; shallow comparisons work.
    				// eslint-disable-next-line eqeqeq
    				if ( b == document || b.ownerDocument == preferredDoc &&
    					contains( preferredDoc, b ) ) {
    					return 1;
    				}

    				// Maintain original order
    				return sortInput ?
    					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
    					0;
    			}

    			return compare & 4 ? -1 : 1;
    		} :
    		function( a, b ) {

    			// Exit early if the nodes are identical
    			if ( a === b ) {
    				hasDuplicate = true;
    				return 0;
    			}

    			var cur,
    				i = 0,
    				aup = a.parentNode,
    				bup = b.parentNode,
    				ap = [ a ],
    				bp = [ b ];

    			// Parentless nodes are either documents or disconnected
    			if ( !aup || !bup ) {

    				// Support: IE 11+, Edge 17 - 18+
    				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    				// two documents; shallow comparisons work.
    				/* eslint-disable eqeqeq */
    				return a == document ? -1 :
    					b == document ? 1 :
    					/* eslint-enable eqeqeq */
    					aup ? -1 :
    					bup ? 1 :
    					sortInput ?
    					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
    					0;

    			// If the nodes are siblings, we can do a quick check
    			} else if ( aup === bup ) {
    				return siblingCheck( a, b );
    			}

    			// Otherwise we need full lists of their ancestors for comparison
    			cur = a;
    			while ( ( cur = cur.parentNode ) ) {
    				ap.unshift( cur );
    			}
    			cur = b;
    			while ( ( cur = cur.parentNode ) ) {
    				bp.unshift( cur );
    			}

    			// Walk down the tree looking for a discrepancy
    			while ( ap[ i ] === bp[ i ] ) {
    				i++;
    			}

    			return i ?

    				// Do a sibling check if the nodes have a common ancestor
    				siblingCheck( ap[ i ], bp[ i ] ) :

    				// Otherwise nodes in our document sort first
    				// Support: IE 11+, Edge 17 - 18+
    				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    				// two documents; shallow comparisons work.
    				/* eslint-disable eqeqeq */
    				ap[ i ] == preferredDoc ? -1 :
    				bp[ i ] == preferredDoc ? 1 :
    				/* eslint-enable eqeqeq */
    				0;
    		};

    		return document;
    	};

    	Sizzle.matches = function( expr, elements ) {
    		return Sizzle( expr, null, null, elements );
    	};

    	Sizzle.matchesSelector = function( elem, expr ) {
    		setDocument( elem );

    		if ( support.matchesSelector && documentIsHTML &&
    			!nonnativeSelectorCache[ expr + " " ] &&
    			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
    			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

    			try {
    				var ret = matches.call( elem, expr );

    				// IE 9's matchesSelector returns false on disconnected nodes
    				if ( ret || support.disconnectedMatch ||

    					// As well, disconnected nodes are said to be in a document
    					// fragment in IE 9
    					elem.document && elem.document.nodeType !== 11 ) {
    					return ret;
    				}
    			} catch ( e ) {
    				nonnativeSelectorCache( expr, true );
    			}
    		}

    		return Sizzle( expr, document, null, [ elem ] ).length > 0;
    	};

    	Sizzle.contains = function( context, elem ) {

    		// Set document vars if needed
    		// Support: IE 11+, Edge 17 - 18+
    		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    		// two documents; shallow comparisons work.
    		// eslint-disable-next-line eqeqeq
    		if ( ( context.ownerDocument || context ) != document ) {
    			setDocument( context );
    		}
    		return contains( context, elem );
    	};

    	Sizzle.attr = function( elem, name ) {

    		// Set document vars if needed
    		// Support: IE 11+, Edge 17 - 18+
    		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    		// two documents; shallow comparisons work.
    		// eslint-disable-next-line eqeqeq
    		if ( ( elem.ownerDocument || elem ) != document ) {
    			setDocument( elem );
    		}

    		var fn = Expr.attrHandle[ name.toLowerCase() ],

    			// Don't get fooled by Object.prototype properties (jQuery #13807)
    			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
    				fn( elem, name, !documentIsHTML ) :
    				undefined;

    		return val !== undefined ?
    			val :
    			support.attributes || !documentIsHTML ?
    				elem.getAttribute( name ) :
    				( val = elem.getAttributeNode( name ) ) && val.specified ?
    					val.value :
    					null;
    	};

    	Sizzle.escape = function( sel ) {
    		return ( sel + "" ).replace( rcssescape, fcssescape );
    	};

    	Sizzle.error = function( msg ) {
    		throw new Error( "Syntax error, unrecognized expression: " + msg );
    	};

    	/**
    	 * Document sorting and removing duplicates
    	 * @param {ArrayLike} results
    	 */
    	Sizzle.uniqueSort = function( results ) {
    		var elem,
    			duplicates = [],
    			j = 0,
    			i = 0;

    		// Unless we *know* we can detect duplicates, assume their presence
    		hasDuplicate = !support.detectDuplicates;
    		sortInput = !support.sortStable && results.slice( 0 );
    		results.sort( sortOrder );

    		if ( hasDuplicate ) {
    			while ( ( elem = results[ i++ ] ) ) {
    				if ( elem === results[ i ] ) {
    					j = duplicates.push( i );
    				}
    			}
    			while ( j-- ) {
    				results.splice( duplicates[ j ], 1 );
    			}
    		}

    		// Clear input after sorting to release objects
    		// See https://github.com/jquery/sizzle/pull/225
    		sortInput = null;

    		return results;
    	};

    	/**
    	 * Utility function for retrieving the text value of an array of DOM nodes
    	 * @param {Array|Element} elem
    	 */
    	getText = Sizzle.getText = function( elem ) {
    		var node,
    			ret = "",
    			i = 0,
    			nodeType = elem.nodeType;

    		if ( !nodeType ) {

    			// If no nodeType, this is expected to be an array
    			while ( ( node = elem[ i++ ] ) ) {

    				// Do not traverse comment nodes
    				ret += getText( node );
    			}
    		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

    			// Use textContent for elements
    			// innerText usage removed for consistency of new lines (jQuery #11153)
    			if ( typeof elem.textContent === "string" ) {
    				return elem.textContent;
    			} else {

    				// Traverse its children
    				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
    					ret += getText( elem );
    				}
    			}
    		} else if ( nodeType === 3 || nodeType === 4 ) {
    			return elem.nodeValue;
    		}

    		// Do not include comment or processing instruction nodes

    		return ret;
    	};

    	Expr = Sizzle.selectors = {

    		// Can be adjusted by the user
    		cacheLength: 50,

    		createPseudo: markFunction,

    		match: matchExpr,

    		attrHandle: {},

    		find: {},

    		relative: {
    			">": { dir: "parentNode", first: true },
    			" ": { dir: "parentNode" },
    			"+": { dir: "previousSibling", first: true },
    			"~": { dir: "previousSibling" }
    		},

    		preFilter: {
    			"ATTR": function( match ) {
    				match[ 1 ] = match[ 1 ].replace( runescape, funescape );

    				// Move the given value to match[3] whether quoted or unquoted
    				match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
    					match[ 5 ] || "" ).replace( runescape, funescape );

    				if ( match[ 2 ] === "~=" ) {
    					match[ 3 ] = " " + match[ 3 ] + " ";
    				}

    				return match.slice( 0, 4 );
    			},

    			"CHILD": function( match ) {

    				/* matches from matchExpr["CHILD"]
    					1 type (only|nth|...)
    					2 what (child|of-type)
    					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
    					4 xn-component of xn+y argument ([+-]?\d*n|)
    					5 sign of xn-component
    					6 x of xn-component
    					7 sign of y-component
    					8 y of y-component
    				*/
    				match[ 1 ] = match[ 1 ].toLowerCase();

    				if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

    					// nth-* requires argument
    					if ( !match[ 3 ] ) {
    						Sizzle.error( match[ 0 ] );
    					}

    					// numeric x and y parameters for Expr.filter.CHILD
    					// remember that false/true cast respectively to 0/1
    					match[ 4 ] = +( match[ 4 ] ?
    						match[ 5 ] + ( match[ 6 ] || 1 ) :
    						2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
    					match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

    					// other types prohibit arguments
    				} else if ( match[ 3 ] ) {
    					Sizzle.error( match[ 0 ] );
    				}

    				return match;
    			},

    			"PSEUDO": function( match ) {
    				var excess,
    					unquoted = !match[ 6 ] && match[ 2 ];

    				if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
    					return null;
    				}

    				// Accept quoted arguments as-is
    				if ( match[ 3 ] ) {
    					match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

    				// Strip excess characters from unquoted arguments
    				} else if ( unquoted && rpseudo.test( unquoted ) &&

    					// Get excess from tokenize (recursively)
    					( excess = tokenize( unquoted, true ) ) &&

    					// advance to the next closing parenthesis
    					( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

    					// excess is a negative index
    					match[ 0 ] = match[ 0 ].slice( 0, excess );
    					match[ 2 ] = unquoted.slice( 0, excess );
    				}

    				// Return only captures needed by the pseudo filter method (type and argument)
    				return match.slice( 0, 3 );
    			}
    		},

    		filter: {

    			"TAG": function( nodeNameSelector ) {
    				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
    				return nodeNameSelector === "*" ?
    					function() {
    						return true;
    					} :
    					function( elem ) {
    						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
    					};
    			},

    			"CLASS": function( className ) {
    				var pattern = classCache[ className + " " ];

    				return pattern ||
    					( pattern = new RegExp( "(^|" + whitespace +
    						")" + className + "(" + whitespace + "|$)" ) ) && classCache(
    							className, function( elem ) {
    								return pattern.test(
    									typeof elem.className === "string" && elem.className ||
    									typeof elem.getAttribute !== "undefined" &&
    										elem.getAttribute( "class" ) ||
    									""
    								);
    					} );
    			},

    			"ATTR": function( name, operator, check ) {
    				return function( elem ) {
    					var result = Sizzle.attr( elem, name );

    					if ( result == null ) {
    						return operator === "!=";
    					}
    					if ( !operator ) {
    						return true;
    					}

    					result += "";

    					/* eslint-disable max-len */

    					return operator === "=" ? result === check :
    						operator === "!=" ? result !== check :
    						operator === "^=" ? check && result.indexOf( check ) === 0 :
    						operator === "*=" ? check && result.indexOf( check ) > -1 :
    						operator === "$=" ? check && result.slice( -check.length ) === check :
    						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
    						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
    						false;
    					/* eslint-enable max-len */

    				};
    			},

    			"CHILD": function( type, what, _argument, first, last ) {
    				var simple = type.slice( 0, 3 ) !== "nth",
    					forward = type.slice( -4 ) !== "last",
    					ofType = what === "of-type";

    				return first === 1 && last === 0 ?

    					// Shortcut for :nth-*(n)
    					function( elem ) {
    						return !!elem.parentNode;
    					} :

    					function( elem, _context, xml ) {
    						var cache, uniqueCache, outerCache, node, nodeIndex, start,
    							dir = simple !== forward ? "nextSibling" : "previousSibling",
    							parent = elem.parentNode,
    							name = ofType && elem.nodeName.toLowerCase(),
    							useCache = !xml && !ofType,
    							diff = false;

    						if ( parent ) {

    							// :(first|last|only)-(child|of-type)
    							if ( simple ) {
    								while ( dir ) {
    									node = elem;
    									while ( ( node = node[ dir ] ) ) {
    										if ( ofType ?
    											node.nodeName.toLowerCase() === name :
    											node.nodeType === 1 ) {

    											return false;
    										}
    									}

    									// Reverse direction for :only-* (if we haven't yet done so)
    									start = dir = type === "only" && !start && "nextSibling";
    								}
    								return true;
    							}

    							start = [ forward ? parent.firstChild : parent.lastChild ];

    							// non-xml :nth-child(...) stores cache data on `parent`
    							if ( forward && useCache ) {

    								// Seek `elem` from a previously-cached index

    								// ...in a gzip-friendly way
    								node = parent;
    								outerCache = node[ expando ] || ( node[ expando ] = {} );

    								// Support: IE <9 only
    								// Defend against cloned attroperties (jQuery gh-1709)
    								uniqueCache = outerCache[ node.uniqueID ] ||
    									( outerCache[ node.uniqueID ] = {} );

    								cache = uniqueCache[ type ] || [];
    								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
    								diff = nodeIndex && cache[ 2 ];
    								node = nodeIndex && parent.childNodes[ nodeIndex ];

    								while ( ( node = ++nodeIndex && node && node[ dir ] ||

    									// Fallback to seeking `elem` from the start
    									( diff = nodeIndex = 0 ) || start.pop() ) ) {

    									// When found, cache indexes on `parent` and break
    									if ( node.nodeType === 1 && ++diff && node === elem ) {
    										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
    										break;
    									}
    								}

    							} else {

    								// Use previously-cached element index if available
    								if ( useCache ) {

    									// ...in a gzip-friendly way
    									node = elem;
    									outerCache = node[ expando ] || ( node[ expando ] = {} );

    									// Support: IE <9 only
    									// Defend against cloned attroperties (jQuery gh-1709)
    									uniqueCache = outerCache[ node.uniqueID ] ||
    										( outerCache[ node.uniqueID ] = {} );

    									cache = uniqueCache[ type ] || [];
    									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
    									diff = nodeIndex;
    								}

    								// xml :nth-child(...)
    								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
    								if ( diff === false ) {

    									// Use the same loop as above to seek `elem` from the start
    									while ( ( node = ++nodeIndex && node && node[ dir ] ||
    										( diff = nodeIndex = 0 ) || start.pop() ) ) {

    										if ( ( ofType ?
    											node.nodeName.toLowerCase() === name :
    											node.nodeType === 1 ) &&
    											++diff ) {

    											// Cache the index of each encountered element
    											if ( useCache ) {
    												outerCache = node[ expando ] ||
    													( node[ expando ] = {} );

    												// Support: IE <9 only
    												// Defend against cloned attroperties (jQuery gh-1709)
    												uniqueCache = outerCache[ node.uniqueID ] ||
    													( outerCache[ node.uniqueID ] = {} );

    												uniqueCache[ type ] = [ dirruns, diff ];
    											}

    											if ( node === elem ) {
    												break;
    											}
    										}
    									}
    								}
    							}

    							// Incorporate the offset, then check against cycle size
    							diff -= last;
    							return diff === first || ( diff % first === 0 && diff / first >= 0 );
    						}
    					};
    			},

    			"PSEUDO": function( pseudo, argument ) {

    				// pseudo-class names are case-insensitive
    				// http://www.w3.org/TR/selectors/#pseudo-classes
    				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
    				// Remember that setFilters inherits from pseudos
    				var args,
    					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
    						Sizzle.error( "unsupported pseudo: " + pseudo );

    				// The user may use createPseudo to indicate that
    				// arguments are needed to create the filter function
    				// just as Sizzle does
    				if ( fn[ expando ] ) {
    					return fn( argument );
    				}

    				// But maintain support for old signatures
    				if ( fn.length > 1 ) {
    					args = [ pseudo, pseudo, "", argument ];
    					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
    						markFunction( function( seed, matches ) {
    							var idx,
    								matched = fn( seed, argument ),
    								i = matched.length;
    							while ( i-- ) {
    								idx = indexOf( seed, matched[ i ] );
    								seed[ idx ] = !( matches[ idx ] = matched[ i ] );
    							}
    						} ) :
    						function( elem ) {
    							return fn( elem, 0, args );
    						};
    				}

    				return fn;
    			}
    		},

    		pseudos: {

    			// Potentially complex pseudos
    			"not": markFunction( function( selector ) {

    				// Trim the selector passed to compile
    				// to avoid treating leading and trailing
    				// spaces as combinators
    				var input = [],
    					results = [],
    					matcher = compile( selector.replace( rtrim, "$1" ) );

    				return matcher[ expando ] ?
    					markFunction( function( seed, matches, _context, xml ) {
    						var elem,
    							unmatched = matcher( seed, null, xml, [] ),
    							i = seed.length;

    						// Match elements unmatched by `matcher`
    						while ( i-- ) {
    							if ( ( elem = unmatched[ i ] ) ) {
    								seed[ i ] = !( matches[ i ] = elem );
    							}
    						}
    					} ) :
    					function( elem, _context, xml ) {
    						input[ 0 ] = elem;
    						matcher( input, null, xml, results );

    						// Don't keep the element (issue #299)
    						input[ 0 ] = null;
    						return !results.pop();
    					};
    			} ),

    			"has": markFunction( function( selector ) {
    				return function( elem ) {
    					return Sizzle( selector, elem ).length > 0;
    				};
    			} ),

    			"contains": markFunction( function( text ) {
    				text = text.replace( runescape, funescape );
    				return function( elem ) {
    					return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
    				};
    			} ),

    			// "Whether an element is represented by a :lang() selector
    			// is based solely on the element's language value
    			// being equal to the identifier C,
    			// or beginning with the identifier C immediately followed by "-".
    			// The matching of C against the element's language value is performed case-insensitively.
    			// The identifier C does not have to be a valid language name."
    			// http://www.w3.org/TR/selectors/#lang-pseudo
    			"lang": markFunction( function( lang ) {

    				// lang value must be a valid identifier
    				if ( !ridentifier.test( lang || "" ) ) {
    					Sizzle.error( "unsupported lang: " + lang );
    				}
    				lang = lang.replace( runescape, funescape ).toLowerCase();
    				return function( elem ) {
    					var elemLang;
    					do {
    						if ( ( elemLang = documentIsHTML ?
    							elem.lang :
    							elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

    							elemLang = elemLang.toLowerCase();
    							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
    						}
    					} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
    					return false;
    				};
    			} ),

    			// Miscellaneous
    			"target": function( elem ) {
    				var hash = window.location && window.location.hash;
    				return hash && hash.slice( 1 ) === elem.id;
    			},

    			"root": function( elem ) {
    				return elem === docElem;
    			},

    			"focus": function( elem ) {
    				return elem === document.activeElement &&
    					( !document.hasFocus || document.hasFocus() ) &&
    					!!( elem.type || elem.href || ~elem.tabIndex );
    			},

    			// Boolean properties
    			"enabled": createDisabledPseudo( false ),
    			"disabled": createDisabledPseudo( true ),

    			"checked": function( elem ) {

    				// In CSS3, :checked should return both checked and selected elements
    				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
    				var nodeName = elem.nodeName.toLowerCase();
    				return ( nodeName === "input" && !!elem.checked ) ||
    					( nodeName === "option" && !!elem.selected );
    			},

    			"selected": function( elem ) {

    				// Accessing this property makes selected-by-default
    				// options in Safari work properly
    				if ( elem.parentNode ) {
    					// eslint-disable-next-line no-unused-expressions
    					elem.parentNode.selectedIndex;
    				}

    				return elem.selected === true;
    			},

    			// Contents
    			"empty": function( elem ) {

    				// http://www.w3.org/TR/selectors/#empty-pseudo
    				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
    				//   but not by others (comment: 8; processing instruction: 7; etc.)
    				// nodeType < 6 works because attributes (2) do not appear as children
    				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
    					if ( elem.nodeType < 6 ) {
    						return false;
    					}
    				}
    				return true;
    			},

    			"parent": function( elem ) {
    				return !Expr.pseudos[ "empty" ]( elem );
    			},

    			// Element/input types
    			"header": function( elem ) {
    				return rheader.test( elem.nodeName );
    			},

    			"input": function( elem ) {
    				return rinputs.test( elem.nodeName );
    			},

    			"button": function( elem ) {
    				var name = elem.nodeName.toLowerCase();
    				return name === "input" && elem.type === "button" || name === "button";
    			},

    			"text": function( elem ) {
    				var attr;
    				return elem.nodeName.toLowerCase() === "input" &&
    					elem.type === "text" &&

    					// Support: IE <10 only
    					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
    					( ( attr = elem.getAttribute( "type" ) ) == null ||
    						attr.toLowerCase() === "text" );
    			},

    			// Position-in-collection
    			"first": createPositionalPseudo( function() {
    				return [ 0 ];
    			} ),

    			"last": createPositionalPseudo( function( _matchIndexes, length ) {
    				return [ length - 1 ];
    			} ),

    			"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
    				return [ argument < 0 ? argument + length : argument ];
    			} ),

    			"even": createPositionalPseudo( function( matchIndexes, length ) {
    				var i = 0;
    				for ( ; i < length; i += 2 ) {
    					matchIndexes.push( i );
    				}
    				return matchIndexes;
    			} ),

    			"odd": createPositionalPseudo( function( matchIndexes, length ) {
    				var i = 1;
    				for ( ; i < length; i += 2 ) {
    					matchIndexes.push( i );
    				}
    				return matchIndexes;
    			} ),

    			"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
    				var i = argument < 0 ?
    					argument + length :
    					argument > length ?
    						length :
    						argument;
    				for ( ; --i >= 0; ) {
    					matchIndexes.push( i );
    				}
    				return matchIndexes;
    			} ),

    			"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
    				var i = argument < 0 ? argument + length : argument;
    				for ( ; ++i < length; ) {
    					matchIndexes.push( i );
    				}
    				return matchIndexes;
    			} )
    		}
    	};

    	Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

    	// Add button/input type pseudos
    	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
    		Expr.pseudos[ i ] = createInputPseudo( i );
    	}
    	for ( i in { submit: true, reset: true } ) {
    		Expr.pseudos[ i ] = createButtonPseudo( i );
    	}

    	// Easy API for creating new setFilters
    	function setFilters() {}
    	setFilters.prototype = Expr.filters = Expr.pseudos;
    	Expr.setFilters = new setFilters();

    	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
    		var matched, match, tokens, type,
    			soFar, groups, preFilters,
    			cached = tokenCache[ selector + " " ];

    		if ( cached ) {
    			return parseOnly ? 0 : cached.slice( 0 );
    		}

    		soFar = selector;
    		groups = [];
    		preFilters = Expr.preFilter;

    		while ( soFar ) {

    			// Comma and first run
    			if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
    				if ( match ) {

    					// Don't consume trailing commas as valid
    					soFar = soFar.slice( match[ 0 ].length ) || soFar;
    				}
    				groups.push( ( tokens = [] ) );
    			}

    			matched = false;

    			// Combinators
    			if ( ( match = rleadingCombinator.exec( soFar ) ) ) {
    				matched = match.shift();
    				tokens.push( {
    					value: matched,

    					// Cast descendant combinators to space
    					type: match[ 0 ].replace( rtrim, " " )
    				} );
    				soFar = soFar.slice( matched.length );
    			}

    			// Filters
    			for ( type in Expr.filter ) {
    				if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
    					( match = preFilters[ type ]( match ) ) ) ) {
    					matched = match.shift();
    					tokens.push( {
    						value: matched,
    						type: type,
    						matches: match
    					} );
    					soFar = soFar.slice( matched.length );
    				}
    			}

    			if ( !matched ) {
    				break;
    			}
    		}

    		// Return the length of the invalid excess
    		// if we're just parsing
    		// Otherwise, throw an error or return tokens
    		return parseOnly ?
    			soFar.length :
    			soFar ?
    				Sizzle.error( selector ) :

    				// Cache the tokens
    				tokenCache( selector, groups ).slice( 0 );
    	};

    	function toSelector( tokens ) {
    		var i = 0,
    			len = tokens.length,
    			selector = "";
    		for ( ; i < len; i++ ) {
    			selector += tokens[ i ].value;
    		}
    		return selector;
    	}

    	function addCombinator( matcher, combinator, base ) {
    		var dir = combinator.dir,
    			skip = combinator.next,
    			key = skip || dir,
    			checkNonElements = base && key === "parentNode",
    			doneName = done++;

    		return combinator.first ?

    			// Check against closest ancestor/preceding element
    			function( elem, context, xml ) {
    				while ( ( elem = elem[ dir ] ) ) {
    					if ( elem.nodeType === 1 || checkNonElements ) {
    						return matcher( elem, context, xml );
    					}
    				}
    				return false;
    			} :

    			// Check against all ancestor/preceding elements
    			function( elem, context, xml ) {
    				var oldCache, uniqueCache, outerCache,
    					newCache = [ dirruns, doneName ];

    				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
    				if ( xml ) {
    					while ( ( elem = elem[ dir ] ) ) {
    						if ( elem.nodeType === 1 || checkNonElements ) {
    							if ( matcher( elem, context, xml ) ) {
    								return true;
    							}
    						}
    					}
    				} else {
    					while ( ( elem = elem[ dir ] ) ) {
    						if ( elem.nodeType === 1 || checkNonElements ) {
    							outerCache = elem[ expando ] || ( elem[ expando ] = {} );

    							// Support: IE <9 only
    							// Defend against cloned attroperties (jQuery gh-1709)
    							uniqueCache = outerCache[ elem.uniqueID ] ||
    								( outerCache[ elem.uniqueID ] = {} );

    							if ( skip && skip === elem.nodeName.toLowerCase() ) {
    								elem = elem[ dir ] || elem;
    							} else if ( ( oldCache = uniqueCache[ key ] ) &&
    								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

    								// Assign to newCache so results back-propagate to previous elements
    								return ( newCache[ 2 ] = oldCache[ 2 ] );
    							} else {

    								// Reuse newcache so results back-propagate to previous elements
    								uniqueCache[ key ] = newCache;

    								// A match means we're done; a fail means we have to keep checking
    								if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
    									return true;
    								}
    							}
    						}
    					}
    				}
    				return false;
    			};
    	}

    	function elementMatcher( matchers ) {
    		return matchers.length > 1 ?
    			function( elem, context, xml ) {
    				var i = matchers.length;
    				while ( i-- ) {
    					if ( !matchers[ i ]( elem, context, xml ) ) {
    						return false;
    					}
    				}
    				return true;
    			} :
    			matchers[ 0 ];
    	}

    	function multipleContexts( selector, contexts, results ) {
    		var i = 0,
    			len = contexts.length;
    		for ( ; i < len; i++ ) {
    			Sizzle( selector, contexts[ i ], results );
    		}
    		return results;
    	}

    	function condense( unmatched, map, filter, context, xml ) {
    		var elem,
    			newUnmatched = [],
    			i = 0,
    			len = unmatched.length,
    			mapped = map != null;

    		for ( ; i < len; i++ ) {
    			if ( ( elem = unmatched[ i ] ) ) {
    				if ( !filter || filter( elem, context, xml ) ) {
    					newUnmatched.push( elem );
    					if ( mapped ) {
    						map.push( i );
    					}
    				}
    			}
    		}

    		return newUnmatched;
    	}

    	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
    		if ( postFilter && !postFilter[ expando ] ) {
    			postFilter = setMatcher( postFilter );
    		}
    		if ( postFinder && !postFinder[ expando ] ) {
    			postFinder = setMatcher( postFinder, postSelector );
    		}
    		return markFunction( function( seed, results, context, xml ) {
    			var temp, i, elem,
    				preMap = [],
    				postMap = [],
    				preexisting = results.length,

    				// Get initial elements from seed or context
    				elems = seed || multipleContexts(
    					selector || "*",
    					context.nodeType ? [ context ] : context,
    					[]
    				),

    				// Prefilter to get matcher input, preserving a map for seed-results synchronization
    				matcherIn = preFilter && ( seed || !selector ) ?
    					condense( elems, preMap, preFilter, context, xml ) :
    					elems,

    				matcherOut = matcher ?

    					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
    					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

    						// ...intermediate processing is necessary
    						[] :

    						// ...otherwise use results directly
    						results :
    					matcherIn;

    			// Find primary matches
    			if ( matcher ) {
    				matcher( matcherIn, matcherOut, context, xml );
    			}

    			// Apply postFilter
    			if ( postFilter ) {
    				temp = condense( matcherOut, postMap );
    				postFilter( temp, [], context, xml );

    				// Un-match failing elements by moving them back to matcherIn
    				i = temp.length;
    				while ( i-- ) {
    					if ( ( elem = temp[ i ] ) ) {
    						matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
    					}
    				}
    			}

    			if ( seed ) {
    				if ( postFinder || preFilter ) {
    					if ( postFinder ) {

    						// Get the final matcherOut by condensing this intermediate into postFinder contexts
    						temp = [];
    						i = matcherOut.length;
    						while ( i-- ) {
    							if ( ( elem = matcherOut[ i ] ) ) {

    								// Restore matcherIn since elem is not yet a final match
    								temp.push( ( matcherIn[ i ] = elem ) );
    							}
    						}
    						postFinder( null, ( matcherOut = [] ), temp, xml );
    					}

    					// Move matched elements from seed to results to keep them synchronized
    					i = matcherOut.length;
    					while ( i-- ) {
    						if ( ( elem = matcherOut[ i ] ) &&
    							( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

    							seed[ temp ] = !( results[ temp ] = elem );
    						}
    					}
    				}

    			// Add elements to results, through postFinder if defined
    			} else {
    				matcherOut = condense(
    					matcherOut === results ?
    						matcherOut.splice( preexisting, matcherOut.length ) :
    						matcherOut
    				);
    				if ( postFinder ) {
    					postFinder( null, results, matcherOut, xml );
    				} else {
    					push.apply( results, matcherOut );
    				}
    			}
    		} );
    	}

    	function matcherFromTokens( tokens ) {
    		var checkContext, matcher, j,
    			len = tokens.length,
    			leadingRelative = Expr.relative[ tokens[ 0 ].type ],
    			implicitRelative = leadingRelative || Expr.relative[ " " ],
    			i = leadingRelative ? 1 : 0,

    			// The foundational matcher ensures that elements are reachable from top-level context(s)
    			matchContext = addCombinator( function( elem ) {
    				return elem === checkContext;
    			}, implicitRelative, true ),
    			matchAnyContext = addCombinator( function( elem ) {
    				return indexOf( checkContext, elem ) > -1;
    			}, implicitRelative, true ),
    			matchers = [ function( elem, context, xml ) {
    				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
    					( checkContext = context ).nodeType ?
    						matchContext( elem, context, xml ) :
    						matchAnyContext( elem, context, xml ) );

    				// Avoid hanging onto element (issue #299)
    				checkContext = null;
    				return ret;
    			} ];

    		for ( ; i < len; i++ ) {
    			if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
    				matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
    			} else {
    				matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

    				// Return special upon seeing a positional matcher
    				if ( matcher[ expando ] ) {

    					// Find the next relative operator (if any) for proper handling
    					j = ++i;
    					for ( ; j < len; j++ ) {
    						if ( Expr.relative[ tokens[ j ].type ] ) {
    							break;
    						}
    					}
    					return setMatcher(
    						i > 1 && elementMatcher( matchers ),
    						i > 1 && toSelector(

    						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
    						tokens
    							.slice( 0, i - 1 )
    							.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
    						).replace( rtrim, "$1" ),
    						matcher,
    						i < j && matcherFromTokens( tokens.slice( i, j ) ),
    						j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
    						j < len && toSelector( tokens )
    					);
    				}
    				matchers.push( matcher );
    			}
    		}

    		return elementMatcher( matchers );
    	}

    	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
    		var bySet = setMatchers.length > 0,
    			byElement = elementMatchers.length > 0,
    			superMatcher = function( seed, context, xml, results, outermost ) {
    				var elem, j, matcher,
    					matchedCount = 0,
    					i = "0",
    					unmatched = seed && [],
    					setMatched = [],
    					contextBackup = outermostContext,

    					// We must always have either seed elements or outermost context
    					elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

    					// Use integer dirruns iff this is the outermost matcher
    					dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
    					len = elems.length;

    				if ( outermost ) {

    					// Support: IE 11+, Edge 17 - 18+
    					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    					// two documents; shallow comparisons work.
    					// eslint-disable-next-line eqeqeq
    					outermostContext = context == document || context || outermost;
    				}

    				// Add elements passing elementMatchers directly to results
    				// Support: IE<9, Safari
    				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
    				for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
    					if ( byElement && elem ) {
    						j = 0;

    						// Support: IE 11+, Edge 17 - 18+
    						// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    						// two documents; shallow comparisons work.
    						// eslint-disable-next-line eqeqeq
    						if ( !context && elem.ownerDocument != document ) {
    							setDocument( elem );
    							xml = !documentIsHTML;
    						}
    						while ( ( matcher = elementMatchers[ j++ ] ) ) {
    							if ( matcher( elem, context || document, xml ) ) {
    								results.push( elem );
    								break;
    							}
    						}
    						if ( outermost ) {
    							dirruns = dirrunsUnique;
    						}
    					}

    					// Track unmatched elements for set filters
    					if ( bySet ) {

    						// They will have gone through all possible matchers
    						if ( ( elem = !matcher && elem ) ) {
    							matchedCount--;
    						}

    						// Lengthen the array for every element, matched or not
    						if ( seed ) {
    							unmatched.push( elem );
    						}
    					}
    				}

    				// `i` is now the count of elements visited above, and adding it to `matchedCount`
    				// makes the latter nonnegative.
    				matchedCount += i;

    				// Apply set filters to unmatched elements
    				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
    				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
    				// no element matchers and no seed.
    				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
    				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
    				// numerically zero.
    				if ( bySet && i !== matchedCount ) {
    					j = 0;
    					while ( ( matcher = setMatchers[ j++ ] ) ) {
    						matcher( unmatched, setMatched, context, xml );
    					}

    					if ( seed ) {

    						// Reintegrate element matches to eliminate the need for sorting
    						if ( matchedCount > 0 ) {
    							while ( i-- ) {
    								if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
    									setMatched[ i ] = pop.call( results );
    								}
    							}
    						}

    						// Discard index placeholder values to get only actual matches
    						setMatched = condense( setMatched );
    					}

    					// Add matches to results
    					push.apply( results, setMatched );

    					// Seedless set matches succeeding multiple successful matchers stipulate sorting
    					if ( outermost && !seed && setMatched.length > 0 &&
    						( matchedCount + setMatchers.length ) > 1 ) {

    						Sizzle.uniqueSort( results );
    					}
    				}

    				// Override manipulation of globals by nested matchers
    				if ( outermost ) {
    					dirruns = dirrunsUnique;
    					outermostContext = contextBackup;
    				}

    				return unmatched;
    			};

    		return bySet ?
    			markFunction( superMatcher ) :
    			superMatcher;
    	}

    	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
    		var i,
    			setMatchers = [],
    			elementMatchers = [],
    			cached = compilerCache[ selector + " " ];

    		if ( !cached ) {

    			// Generate a function of recursive functions that can be used to check each element
    			if ( !match ) {
    				match = tokenize( selector );
    			}
    			i = match.length;
    			while ( i-- ) {
    				cached = matcherFromTokens( match[ i ] );
    				if ( cached[ expando ] ) {
    					setMatchers.push( cached );
    				} else {
    					elementMatchers.push( cached );
    				}
    			}

    			// Cache the compiled function
    			cached = compilerCache(
    				selector,
    				matcherFromGroupMatchers( elementMatchers, setMatchers )
    			);

    			// Save selector and tokenization
    			cached.selector = selector;
    		}
    		return cached;
    	};

    	/**
    	 * A low-level selection function that works with Sizzle's compiled
    	 *  selector functions
    	 * @param {String|Function} selector A selector or a pre-compiled
    	 *  selector function built with Sizzle.compile
    	 * @param {Element} context
    	 * @param {Array} [results]
    	 * @param {Array} [seed] A set of elements to match against
    	 */
    	select = Sizzle.select = function( selector, context, results, seed ) {
    		var i, tokens, token, type, find,
    			compiled = typeof selector === "function" && selector,
    			match = !seed && tokenize( ( selector = compiled.selector || selector ) );

    		results = results || [];

    		// Try to minimize operations if there is only one selector in the list and no seed
    		// (the latter of which guarantees us context)
    		if ( match.length === 1 ) {

    			// Reduce context if the leading compound selector is an ID
    			tokens = match[ 0 ] = match[ 0 ].slice( 0 );
    			if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
    				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

    				context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
    					.replace( runescape, funescape ), context ) || [] )[ 0 ];
    				if ( !context ) {
    					return results;

    				// Precompiled matchers will still verify ancestry, so step up a level
    				} else if ( compiled ) {
    					context = context.parentNode;
    				}

    				selector = selector.slice( tokens.shift().value.length );
    			}

    			// Fetch a seed set for right-to-left matching
    			i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
    			while ( i-- ) {
    				token = tokens[ i ];

    				// Abort if we hit a combinator
    				if ( Expr.relative[ ( type = token.type ) ] ) {
    					break;
    				}
    				if ( ( find = Expr.find[ type ] ) ) {

    					// Search, expanding context for leading sibling combinators
    					if ( ( seed = find(
    						token.matches[ 0 ].replace( runescape, funescape ),
    						rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
    							context
    					) ) ) {

    						// If seed is empty or no tokens remain, we can return early
    						tokens.splice( i, 1 );
    						selector = seed.length && toSelector( tokens );
    						if ( !selector ) {
    							push.apply( results, seed );
    							return results;
    						}

    						break;
    					}
    				}
    			}
    		}

    		// Compile and execute a filtering function if one is not provided
    		// Provide `match` to avoid retokenization if we modified the selector above
    		( compiled || compile( selector, match ) )(
    			seed,
    			context,
    			!documentIsHTML,
    			results,
    			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
    		);
    		return results;
    	};

    	// One-time assignments

    	// Sort stability
    	support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

    	// Support: Chrome 14-35+
    	// Always assume duplicates if they aren't passed to the comparison function
    	support.detectDuplicates = !!hasDuplicate;

    	// Initialize against the default document
    	setDocument();

    	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
    	// Detached nodes confoundingly follow *each other*
    	support.sortDetached = assert( function( el ) {

    		// Should return 1, but returns 4 (following)
    		return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
    	} );

    	// Support: IE<8
    	// Prevent attribute/property "interpolation"
    	// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    	if ( !assert( function( el ) {
    		el.innerHTML = "<a href='#'></a>";
    		return el.firstChild.getAttribute( "href" ) === "#";
    	} ) ) {
    		addHandle( "type|href|height|width", function( elem, name, isXML ) {
    			if ( !isXML ) {
    				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
    			}
    		} );
    	}

    	// Support: IE<9
    	// Use defaultValue in place of getAttribute("value")
    	if ( !support.attributes || !assert( function( el ) {
    		el.innerHTML = "<input/>";
    		el.firstChild.setAttribute( "value", "" );
    		return el.firstChild.getAttribute( "value" ) === "";
    	} ) ) {
    		addHandle( "value", function( elem, _name, isXML ) {
    			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
    				return elem.defaultValue;
    			}
    		} );
    	}

    	// Support: IE<9
    	// Use getAttributeNode to fetch booleans when getAttribute lies
    	if ( !assert( function( el ) {
    		return el.getAttribute( "disabled" ) == null;
    	} ) ) {
    		addHandle( booleans, function( elem, name, isXML ) {
    			var val;
    			if ( !isXML ) {
    				return elem[ name ] === true ? name.toLowerCase() :
    					( val = elem.getAttributeNode( name ) ) && val.specified ?
    						val.value :
    						null;
    			}
    		} );
    	}

    	return Sizzle;

    	} )( window );



    	jQuery.find = Sizzle;
    	jQuery.expr = Sizzle.selectors;

    	// Deprecated
    	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
    	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
    	jQuery.text = Sizzle.getText;
    	jQuery.isXMLDoc = Sizzle.isXML;
    	jQuery.contains = Sizzle.contains;
    	jQuery.escapeSelector = Sizzle.escape;




    	var dir = function( elem, dir, until ) {
    		var matched = [],
    			truncate = until !== undefined;

    		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
    			if ( elem.nodeType === 1 ) {
    				if ( truncate && jQuery( elem ).is( until ) ) {
    					break;
    				}
    				matched.push( elem );
    			}
    		}
    		return matched;
    	};


    	var siblings = function( n, elem ) {
    		var matched = [];

    		for ( ; n; n = n.nextSibling ) {
    			if ( n.nodeType === 1 && n !== elem ) {
    				matched.push( n );
    			}
    		}

    		return matched;
    	};


    	var rneedsContext = jQuery.expr.match.needsContext;



    	function nodeName( elem, name ) {

    		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

    	}
    	var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



    	// Implement the identical functionality for filter and not
    	function winnow( elements, qualifier, not ) {
    		if ( isFunction( qualifier ) ) {
    			return jQuery.grep( elements, function( elem, i ) {
    				return !!qualifier.call( elem, i, elem ) !== not;
    			} );
    		}

    		// Single element
    		if ( qualifier.nodeType ) {
    			return jQuery.grep( elements, function( elem ) {
    				return ( elem === qualifier ) !== not;
    			} );
    		}

    		// Arraylike of elements (jQuery, arguments, Array)
    		if ( typeof qualifier !== "string" ) {
    			return jQuery.grep( elements, function( elem ) {
    				return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
    			} );
    		}

    		// Filtered directly for both simple and complex selectors
    		return jQuery.filter( qualifier, elements, not );
    	}

    	jQuery.filter = function( expr, elems, not ) {
    		var elem = elems[ 0 ];

    		if ( not ) {
    			expr = ":not(" + expr + ")";
    		}

    		if ( elems.length === 1 && elem.nodeType === 1 ) {
    			return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
    		}

    		return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
    			return elem.nodeType === 1;
    		} ) );
    	};

    	jQuery.fn.extend( {
    		find: function( selector ) {
    			var i, ret,
    				len = this.length,
    				self = this;

    			if ( typeof selector !== "string" ) {
    				return this.pushStack( jQuery( selector ).filter( function() {
    					for ( i = 0; i < len; i++ ) {
    						if ( jQuery.contains( self[ i ], this ) ) {
    							return true;
    						}
    					}
    				} ) );
    			}

    			ret = this.pushStack( [] );

    			for ( i = 0; i < len; i++ ) {
    				jQuery.find( selector, self[ i ], ret );
    			}

    			return len > 1 ? jQuery.uniqueSort( ret ) : ret;
    		},
    		filter: function( selector ) {
    			return this.pushStack( winnow( this, selector || [], false ) );
    		},
    		not: function( selector ) {
    			return this.pushStack( winnow( this, selector || [], true ) );
    		},
    		is: function( selector ) {
    			return !!winnow(
    				this,

    				// If this is a positional/relative selector, check membership in the returned set
    				// so $("p:first").is("p:last") won't return true for a doc with two "p".
    				typeof selector === "string" && rneedsContext.test( selector ) ?
    					jQuery( selector ) :
    					selector || [],
    				false
    			).length;
    		}
    	} );


    	// Initialize a jQuery object


    	// A central reference to the root jQuery(document)
    	var rootjQuery,

    		// A simple way to check for HTML strings
    		// Prioritize #id over <tag> to avoid XSS via location.hash (trac-9521)
    		// Strict HTML recognition (trac-11290: must start with <)
    		// Shortcut simple #id case for speed
    		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

    		init = jQuery.fn.init = function( selector, context, root ) {
    			var match, elem;

    			// HANDLE: $(""), $(null), $(undefined), $(false)
    			if ( !selector ) {
    				return this;
    			}

    			// Method init() accepts an alternate rootjQuery
    			// so migrate can support jQuery.sub (gh-2101)
    			root = root || rootjQuery;

    			// Handle HTML strings
    			if ( typeof selector === "string" ) {
    				if ( selector[ 0 ] === "<" &&
    					selector[ selector.length - 1 ] === ">" &&
    					selector.length >= 3 ) {

    					// Assume that strings that start and end with <> are HTML and skip the regex check
    					match = [ null, selector, null ];

    				} else {
    					match = rquickExpr.exec( selector );
    				}

    				// Match html or make sure no context is specified for #id
    				if ( match && ( match[ 1 ] || !context ) ) {

    					// HANDLE: $(html) -> $(array)
    					if ( match[ 1 ] ) {
    						context = context instanceof jQuery ? context[ 0 ] : context;

    						// Option to run scripts is true for back-compat
    						// Intentionally let the error be thrown if parseHTML is not present
    						jQuery.merge( this, jQuery.parseHTML(
    							match[ 1 ],
    							context && context.nodeType ? context.ownerDocument || context : document,
    							true
    						) );

    						// HANDLE: $(html, props)
    						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
    							for ( match in context ) {

    								// Properties of context are called as methods if possible
    								if ( isFunction( this[ match ] ) ) {
    									this[ match ]( context[ match ] );

    								// ...and otherwise set as attributes
    								} else {
    									this.attr( match, context[ match ] );
    								}
    							}
    						}

    						return this;

    					// HANDLE: $(#id)
    					} else {
    						elem = document.getElementById( match[ 2 ] );

    						if ( elem ) {

    							// Inject the element directly into the jQuery object
    							this[ 0 ] = elem;
    							this.length = 1;
    						}
    						return this;
    					}

    				// HANDLE: $(expr, $(...))
    				} else if ( !context || context.jquery ) {
    					return ( context || root ).find( selector );

    				// HANDLE: $(expr, context)
    				// (which is just equivalent to: $(context).find(expr)
    				} else {
    					return this.constructor( context ).find( selector );
    				}

    			// HANDLE: $(DOMElement)
    			} else if ( selector.nodeType ) {
    				this[ 0 ] = selector;
    				this.length = 1;
    				return this;

    			// HANDLE: $(function)
    			// Shortcut for document ready
    			} else if ( isFunction( selector ) ) {
    				return root.ready !== undefined ?
    					root.ready( selector ) :

    					// Execute immediately if ready is not present
    					selector( jQuery );
    			}

    			return jQuery.makeArray( selector, this );
    		};

    	// Give the init function the jQuery prototype for later instantiation
    	init.prototype = jQuery.fn;

    	// Initialize central reference
    	rootjQuery = jQuery( document );


    	var rparentsprev = /^(?:parents|prev(?:Until|All))/,

    		// Methods guaranteed to produce a unique set when starting from a unique set
    		guaranteedUnique = {
    			children: true,
    			contents: true,
    			next: true,
    			prev: true
    		};

    	jQuery.fn.extend( {
    		has: function( target ) {
    			var targets = jQuery( target, this ),
    				l = targets.length;

    			return this.filter( function() {
    				var i = 0;
    				for ( ; i < l; i++ ) {
    					if ( jQuery.contains( this, targets[ i ] ) ) {
    						return true;
    					}
    				}
    			} );
    		},

    		closest: function( selectors, context ) {
    			var cur,
    				i = 0,
    				l = this.length,
    				matched = [],
    				targets = typeof selectors !== "string" && jQuery( selectors );

    			// Positional selectors never match, since there's no _selection_ context
    			if ( !rneedsContext.test( selectors ) ) {
    				for ( ; i < l; i++ ) {
    					for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

    						// Always skip document fragments
    						if ( cur.nodeType < 11 && ( targets ?
    							targets.index( cur ) > -1 :

    							// Don't pass non-elements to Sizzle
    							cur.nodeType === 1 &&
    								jQuery.find.matchesSelector( cur, selectors ) ) ) {

    							matched.push( cur );
    							break;
    						}
    					}
    				}
    			}

    			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
    		},

    		// Determine the position of an element within the set
    		index: function( elem ) {

    			// No argument, return index in parent
    			if ( !elem ) {
    				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
    			}

    			// Index in selector
    			if ( typeof elem === "string" ) {
    				return indexOf.call( jQuery( elem ), this[ 0 ] );
    			}

    			// Locate the position of the desired element
    			return indexOf.call( this,

    				// If it receives a jQuery object, the first element is used
    				elem.jquery ? elem[ 0 ] : elem
    			);
    		},

    		add: function( selector, context ) {
    			return this.pushStack(
    				jQuery.uniqueSort(
    					jQuery.merge( this.get(), jQuery( selector, context ) )
    				)
    			);
    		},

    		addBack: function( selector ) {
    			return this.add( selector == null ?
    				this.prevObject : this.prevObject.filter( selector )
    			);
    		}
    	} );

    	function sibling( cur, dir ) {
    		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
    		return cur;
    	}

    	jQuery.each( {
    		parent: function( elem ) {
    			var parent = elem.parentNode;
    			return parent && parent.nodeType !== 11 ? parent : null;
    		},
    		parents: function( elem ) {
    			return dir( elem, "parentNode" );
    		},
    		parentsUntil: function( elem, _i, until ) {
    			return dir( elem, "parentNode", until );
    		},
    		next: function( elem ) {
    			return sibling( elem, "nextSibling" );
    		},
    		prev: function( elem ) {
    			return sibling( elem, "previousSibling" );
    		},
    		nextAll: function( elem ) {
    			return dir( elem, "nextSibling" );
    		},
    		prevAll: function( elem ) {
    			return dir( elem, "previousSibling" );
    		},
    		nextUntil: function( elem, _i, until ) {
    			return dir( elem, "nextSibling", until );
    		},
    		prevUntil: function( elem, _i, until ) {
    			return dir( elem, "previousSibling", until );
    		},
    		siblings: function( elem ) {
    			return siblings( ( elem.parentNode || {} ).firstChild, elem );
    		},
    		children: function( elem ) {
    			return siblings( elem.firstChild );
    		},
    		contents: function( elem ) {
    			if ( elem.contentDocument != null &&

    				// Support: IE 11+
    				// <object> elements with no `data` attribute has an object
    				// `contentDocument` with a `null` prototype.
    				getProto( elem.contentDocument ) ) {

    				return elem.contentDocument;
    			}

    			// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
    			// Treat the template element as a regular one in browsers that
    			// don't support it.
    			if ( nodeName( elem, "template" ) ) {
    				elem = elem.content || elem;
    			}

    			return jQuery.merge( [], elem.childNodes );
    		}
    	}, function( name, fn ) {
    		jQuery.fn[ name ] = function( until, selector ) {
    			var matched = jQuery.map( this, fn, until );

    			if ( name.slice( -5 ) !== "Until" ) {
    				selector = until;
    			}

    			if ( selector && typeof selector === "string" ) {
    				matched = jQuery.filter( selector, matched );
    			}

    			if ( this.length > 1 ) {

    				// Remove duplicates
    				if ( !guaranteedUnique[ name ] ) {
    					jQuery.uniqueSort( matched );
    				}

    				// Reverse order for parents* and prev-derivatives
    				if ( rparentsprev.test( name ) ) {
    					matched.reverse();
    				}
    			}

    			return this.pushStack( matched );
    		};
    	} );
    	var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



    	// Convert String-formatted options into Object-formatted ones
    	function createOptions( options ) {
    		var object = {};
    		jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
    			object[ flag ] = true;
    		} );
    		return object;
    	}

    	/*
    	 * Create a callback list using the following parameters:
    	 *
    	 *	options: an optional list of space-separated options that will change how
    	 *			the callback list behaves or a more traditional option object
    	 *
    	 * By default a callback list will act like an event callback list and can be
    	 * "fired" multiple times.
    	 *
    	 * Possible options:
    	 *
    	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
    	 *
    	 *	memory:			will keep track of previous values and will call any callback added
    	 *					after the list has been fired right away with the latest "memorized"
    	 *					values (like a Deferred)
    	 *
    	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
    	 *
    	 *	stopOnFalse:	interrupt callings when a callback returns false
    	 *
    	 */
    	jQuery.Callbacks = function( options ) {

    		// Convert options from String-formatted to Object-formatted if needed
    		// (we check in cache first)
    		options = typeof options === "string" ?
    			createOptions( options ) :
    			jQuery.extend( {}, options );

    		var // Flag to know if list is currently firing
    			firing,

    			// Last fire value for non-forgettable lists
    			memory,

    			// Flag to know if list was already fired
    			fired,

    			// Flag to prevent firing
    			locked,

    			// Actual callback list
    			list = [],

    			// Queue of execution data for repeatable lists
    			queue = [],

    			// Index of currently firing callback (modified by add/remove as needed)
    			firingIndex = -1,

    			// Fire callbacks
    			fire = function() {

    				// Enforce single-firing
    				locked = locked || options.once;

    				// Execute callbacks for all pending executions,
    				// respecting firingIndex overrides and runtime changes
    				fired = firing = true;
    				for ( ; queue.length; firingIndex = -1 ) {
    					memory = queue.shift();
    					while ( ++firingIndex < list.length ) {

    						// Run callback and check for early termination
    						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
    							options.stopOnFalse ) {

    							// Jump to end and forget the data so .add doesn't re-fire
    							firingIndex = list.length;
    							memory = false;
    						}
    					}
    				}

    				// Forget the data if we're done with it
    				if ( !options.memory ) {
    					memory = false;
    				}

    				firing = false;

    				// Clean up if we're done firing for good
    				if ( locked ) {

    					// Keep an empty list if we have data for future add calls
    					if ( memory ) {
    						list = [];

    					// Otherwise, this object is spent
    					} else {
    						list = "";
    					}
    				}
    			},

    			// Actual Callbacks object
    			self = {

    				// Add a callback or a collection of callbacks to the list
    				add: function() {
    					if ( list ) {

    						// If we have memory from a past run, we should fire after adding
    						if ( memory && !firing ) {
    							firingIndex = list.length - 1;
    							queue.push( memory );
    						}

    						( function add( args ) {
    							jQuery.each( args, function( _, arg ) {
    								if ( isFunction( arg ) ) {
    									if ( !options.unique || !self.has( arg ) ) {
    										list.push( arg );
    									}
    								} else if ( arg && arg.length && toType( arg ) !== "string" ) {

    									// Inspect recursively
    									add( arg );
    								}
    							} );
    						} )( arguments );

    						if ( memory && !firing ) {
    							fire();
    						}
    					}
    					return this;
    				},

    				// Remove a callback from the list
    				remove: function() {
    					jQuery.each( arguments, function( _, arg ) {
    						var index;
    						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
    							list.splice( index, 1 );

    							// Handle firing indexes
    							if ( index <= firingIndex ) {
    								firingIndex--;
    							}
    						}
    					} );
    					return this;
    				},

    				// Check if a given callback is in the list.
    				// If no argument is given, return whether or not list has callbacks attached.
    				has: function( fn ) {
    					return fn ?
    						jQuery.inArray( fn, list ) > -1 :
    						list.length > 0;
    				},

    				// Remove all callbacks from the list
    				empty: function() {
    					if ( list ) {
    						list = [];
    					}
    					return this;
    				},

    				// Disable .fire and .add
    				// Abort any current/pending executions
    				// Clear all callbacks and values
    				disable: function() {
    					locked = queue = [];
    					list = memory = "";
    					return this;
    				},
    				disabled: function() {
    					return !list;
    				},

    				// Disable .fire
    				// Also disable .add unless we have memory (since it would have no effect)
    				// Abort any pending executions
    				lock: function() {
    					locked = queue = [];
    					if ( !memory && !firing ) {
    						list = memory = "";
    					}
    					return this;
    				},
    				locked: function() {
    					return !!locked;
    				},

    				// Call all callbacks with the given context and arguments
    				fireWith: function( context, args ) {
    					if ( !locked ) {
    						args = args || [];
    						args = [ context, args.slice ? args.slice() : args ];
    						queue.push( args );
    						if ( !firing ) {
    							fire();
    						}
    					}
    					return this;
    				},

    				// Call all the callbacks with the given arguments
    				fire: function() {
    					self.fireWith( this, arguments );
    					return this;
    				},

    				// To know if the callbacks have already been called at least once
    				fired: function() {
    					return !!fired;
    				}
    			};

    		return self;
    	};


    	function Identity( v ) {
    		return v;
    	}
    	function Thrower( ex ) {
    		throw ex;
    	}

    	function adoptValue( value, resolve, reject, noValue ) {
    		var method;

    		try {

    			// Check for promise aspect first to privilege synchronous behavior
    			if ( value && isFunction( ( method = value.promise ) ) ) {
    				method.call( value ).done( resolve ).fail( reject );

    			// Other thenables
    			} else if ( value && isFunction( ( method = value.then ) ) ) {
    				method.call( value, resolve, reject );

    			// Other non-thenables
    			} else {

    				// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
    				// * false: [ value ].slice( 0 ) => resolve( value )
    				// * true: [ value ].slice( 1 ) => resolve()
    				resolve.apply( undefined, [ value ].slice( noValue ) );
    			}

    		// For Promises/A+, convert exceptions into rejections
    		// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
    		// Deferred#then to conditionally suppress rejection.
    		} catch ( value ) {

    			// Support: Android 4.0 only
    			// Strict mode functions invoked without .call/.apply get global-object context
    			reject.apply( undefined, [ value ] );
    		}
    	}

    	jQuery.extend( {

    		Deferred: function( func ) {
    			var tuples = [

    					// action, add listener, callbacks,
    					// ... .then handlers, argument index, [final state]
    					[ "notify", "progress", jQuery.Callbacks( "memory" ),
    						jQuery.Callbacks( "memory" ), 2 ],
    					[ "resolve", "done", jQuery.Callbacks( "once memory" ),
    						jQuery.Callbacks( "once memory" ), 0, "resolved" ],
    					[ "reject", "fail", jQuery.Callbacks( "once memory" ),
    						jQuery.Callbacks( "once memory" ), 1, "rejected" ]
    				],
    				state = "pending",
    				promise = {
    					state: function() {
    						return state;
    					},
    					always: function() {
    						deferred.done( arguments ).fail( arguments );
    						return this;
    					},
    					"catch": function( fn ) {
    						return promise.then( null, fn );
    					},

    					// Keep pipe for back-compat
    					pipe: function( /* fnDone, fnFail, fnProgress */ ) {
    						var fns = arguments;

    						return jQuery.Deferred( function( newDefer ) {
    							jQuery.each( tuples, function( _i, tuple ) {

    								// Map tuples (progress, done, fail) to arguments (done, fail, progress)
    								var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

    								// deferred.progress(function() { bind to newDefer or newDefer.notify })
    								// deferred.done(function() { bind to newDefer or newDefer.resolve })
    								// deferred.fail(function() { bind to newDefer or newDefer.reject })
    								deferred[ tuple[ 1 ] ]( function() {
    									var returned = fn && fn.apply( this, arguments );
    									if ( returned && isFunction( returned.promise ) ) {
    										returned.promise()
    											.progress( newDefer.notify )
    											.done( newDefer.resolve )
    											.fail( newDefer.reject );
    									} else {
    										newDefer[ tuple[ 0 ] + "With" ](
    											this,
    											fn ? [ returned ] : arguments
    										);
    									}
    								} );
    							} );
    							fns = null;
    						} ).promise();
    					},
    					then: function( onFulfilled, onRejected, onProgress ) {
    						var maxDepth = 0;
    						function resolve( depth, deferred, handler, special ) {
    							return function() {
    								var that = this,
    									args = arguments,
    									mightThrow = function() {
    										var returned, then;

    										// Support: Promises/A+ section 2.3.3.3.3
    										// https://promisesaplus.com/#point-59
    										// Ignore double-resolution attempts
    										if ( depth < maxDepth ) {
    											return;
    										}

    										returned = handler.apply( that, args );

    										// Support: Promises/A+ section 2.3.1
    										// https://promisesaplus.com/#point-48
    										if ( returned === deferred.promise() ) {
    											throw new TypeError( "Thenable self-resolution" );
    										}

    										// Support: Promises/A+ sections 2.3.3.1, 3.5
    										// https://promisesaplus.com/#point-54
    										// https://promisesaplus.com/#point-75
    										// Retrieve `then` only once
    										then = returned &&

    											// Support: Promises/A+ section 2.3.4
    											// https://promisesaplus.com/#point-64
    											// Only check objects and functions for thenability
    											( typeof returned === "object" ||
    												typeof returned === "function" ) &&
    											returned.then;

    										// Handle a returned thenable
    										if ( isFunction( then ) ) {

    											// Special processors (notify) just wait for resolution
    											if ( special ) {
    												then.call(
    													returned,
    													resolve( maxDepth, deferred, Identity, special ),
    													resolve( maxDepth, deferred, Thrower, special )
    												);

    											// Normal processors (resolve) also hook into progress
    											} else {

    												// ...and disregard older resolution values
    												maxDepth++;

    												then.call(
    													returned,
    													resolve( maxDepth, deferred, Identity, special ),
    													resolve( maxDepth, deferred, Thrower, special ),
    													resolve( maxDepth, deferred, Identity,
    														deferred.notifyWith )
    												);
    											}

    										// Handle all other returned values
    										} else {

    											// Only substitute handlers pass on context
    											// and multiple values (non-spec behavior)
    											if ( handler !== Identity ) {
    												that = undefined;
    												args = [ returned ];
    											}

    											// Process the value(s)
    											// Default process is resolve
    											( special || deferred.resolveWith )( that, args );
    										}
    									},

    									// Only normal processors (resolve) catch and reject exceptions
    									process = special ?
    										mightThrow :
    										function() {
    											try {
    												mightThrow();
    											} catch ( e ) {

    												if ( jQuery.Deferred.exceptionHook ) {
    													jQuery.Deferred.exceptionHook( e,
    														process.stackTrace );
    												}

    												// Support: Promises/A+ section 2.3.3.3.4.1
    												// https://promisesaplus.com/#point-61
    												// Ignore post-resolution exceptions
    												if ( depth + 1 >= maxDepth ) {

    													// Only substitute handlers pass on context
    													// and multiple values (non-spec behavior)
    													if ( handler !== Thrower ) {
    														that = undefined;
    														args = [ e ];
    													}

    													deferred.rejectWith( that, args );
    												}
    											}
    										};

    								// Support: Promises/A+ section 2.3.3.3.1
    								// https://promisesaplus.com/#point-57
    								// Re-resolve promises immediately to dodge false rejection from
    								// subsequent errors
    								if ( depth ) {
    									process();
    								} else {

    									// Call an optional hook to record the stack, in case of exception
    									// since it's otherwise lost when execution goes async
    									if ( jQuery.Deferred.getStackHook ) {
    										process.stackTrace = jQuery.Deferred.getStackHook();
    									}
    									window.setTimeout( process );
    								}
    							};
    						}

    						return jQuery.Deferred( function( newDefer ) {

    							// progress_handlers.add( ... )
    							tuples[ 0 ][ 3 ].add(
    								resolve(
    									0,
    									newDefer,
    									isFunction( onProgress ) ?
    										onProgress :
    										Identity,
    									newDefer.notifyWith
    								)
    							);

    							// fulfilled_handlers.add( ... )
    							tuples[ 1 ][ 3 ].add(
    								resolve(
    									0,
    									newDefer,
    									isFunction( onFulfilled ) ?
    										onFulfilled :
    										Identity
    								)
    							);

    							// rejected_handlers.add( ... )
    							tuples[ 2 ][ 3 ].add(
    								resolve(
    									0,
    									newDefer,
    									isFunction( onRejected ) ?
    										onRejected :
    										Thrower
    								)
    							);
    						} ).promise();
    					},

    					// Get a promise for this deferred
    					// If obj is provided, the promise aspect is added to the object
    					promise: function( obj ) {
    						return obj != null ? jQuery.extend( obj, promise ) : promise;
    					}
    				},
    				deferred = {};

    			// Add list-specific methods
    			jQuery.each( tuples, function( i, tuple ) {
    				var list = tuple[ 2 ],
    					stateString = tuple[ 5 ];

    				// promise.progress = list.add
    				// promise.done = list.add
    				// promise.fail = list.add
    				promise[ tuple[ 1 ] ] = list.add;

    				// Handle state
    				if ( stateString ) {
    					list.add(
    						function() {

    							// state = "resolved" (i.e., fulfilled)
    							// state = "rejected"
    							state = stateString;
    						},

    						// rejected_callbacks.disable
    						// fulfilled_callbacks.disable
    						tuples[ 3 - i ][ 2 ].disable,

    						// rejected_handlers.disable
    						// fulfilled_handlers.disable
    						tuples[ 3 - i ][ 3 ].disable,

    						// progress_callbacks.lock
    						tuples[ 0 ][ 2 ].lock,

    						// progress_handlers.lock
    						tuples[ 0 ][ 3 ].lock
    					);
    				}

    				// progress_handlers.fire
    				// fulfilled_handlers.fire
    				// rejected_handlers.fire
    				list.add( tuple[ 3 ].fire );

    				// deferred.notify = function() { deferred.notifyWith(...) }
    				// deferred.resolve = function() { deferred.resolveWith(...) }
    				// deferred.reject = function() { deferred.rejectWith(...) }
    				deferred[ tuple[ 0 ] ] = function() {
    					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
    					return this;
    				};

    				// deferred.notifyWith = list.fireWith
    				// deferred.resolveWith = list.fireWith
    				// deferred.rejectWith = list.fireWith
    				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
    			} );

    			// Make the deferred a promise
    			promise.promise( deferred );

    			// Call given func if any
    			if ( func ) {
    				func.call( deferred, deferred );
    			}

    			// All done!
    			return deferred;
    		},

    		// Deferred helper
    		when: function( singleValue ) {
    			var

    				// count of uncompleted subordinates
    				remaining = arguments.length,

    				// count of unprocessed arguments
    				i = remaining,

    				// subordinate fulfillment data
    				resolveContexts = Array( i ),
    				resolveValues = slice.call( arguments ),

    				// the primary Deferred
    				primary = jQuery.Deferred(),

    				// subordinate callback factory
    				updateFunc = function( i ) {
    					return function( value ) {
    						resolveContexts[ i ] = this;
    						resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
    						if ( !( --remaining ) ) {
    							primary.resolveWith( resolveContexts, resolveValues );
    						}
    					};
    				};

    			// Single- and empty arguments are adopted like Promise.resolve
    			if ( remaining <= 1 ) {
    				adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
    					!remaining );

    				// Use .then() to unwrap secondary thenables (cf. gh-3000)
    				if ( primary.state() === "pending" ||
    					isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

    					return primary.then();
    				}
    			}

    			// Multiple arguments are aggregated like Promise.all array elements
    			while ( i-- ) {
    				adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
    			}

    			return primary.promise();
    		}
    	} );


    	// These usually indicate a programmer mistake during development,
    	// warn about them ASAP rather than swallowing them by default.
    	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

    	jQuery.Deferred.exceptionHook = function( error, stack ) {

    		// Support: IE 8 - 9 only
    		// Console exists when dev tools are open, which can happen at any time
    		if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
    			window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
    		}
    	};




    	jQuery.readyException = function( error ) {
    		window.setTimeout( function() {
    			throw error;
    		} );
    	};




    	// The deferred used on DOM ready
    	var readyList = jQuery.Deferred();

    	jQuery.fn.ready = function( fn ) {

    		readyList
    			.then( fn )

    			// Wrap jQuery.readyException in a function so that the lookup
    			// happens at the time of error handling instead of callback
    			// registration.
    			.catch( function( error ) {
    				jQuery.readyException( error );
    			} );

    		return this;
    	};

    	jQuery.extend( {

    		// Is the DOM ready to be used? Set to true once it occurs.
    		isReady: false,

    		// A counter to track how many items to wait for before
    		// the ready event fires. See trac-6781
    		readyWait: 1,

    		// Handle when the DOM is ready
    		ready: function( wait ) {

    			// Abort if there are pending holds or we're already ready
    			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
    				return;
    			}

    			// Remember that the DOM is ready
    			jQuery.isReady = true;

    			// If a normal DOM Ready event fired, decrement, and wait if need be
    			if ( wait !== true && --jQuery.readyWait > 0 ) {
    				return;
    			}

    			// If there are functions bound, to execute
    			readyList.resolveWith( document, [ jQuery ] );
    		}
    	} );

    	jQuery.ready.then = readyList.then;

    	// The ready event handler and self cleanup method
    	function completed() {
    		document.removeEventListener( "DOMContentLoaded", completed );
    		window.removeEventListener( "load", completed );
    		jQuery.ready();
    	}

    	// Catch cases where $(document).ready() is called
    	// after the browser event has already occurred.
    	// Support: IE <=9 - 10 only
    	// Older IE sometimes signals "interactive" too soon
    	if ( document.readyState === "complete" ||
    		( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

    		// Handle it asynchronously to allow scripts the opportunity to delay ready
    		window.setTimeout( jQuery.ready );

    	} else {

    		// Use the handy event callback
    		document.addEventListener( "DOMContentLoaded", completed );

    		// A fallback to window.onload, that will always work
    		window.addEventListener( "load", completed );
    	}




    	// Multifunctional method to get and set values of a collection
    	// The value/s can optionally be executed if it's a function
    	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
    		var i = 0,
    			len = elems.length,
    			bulk = key == null;

    		// Sets many values
    		if ( toType( key ) === "object" ) {
    			chainable = true;
    			for ( i in key ) {
    				access( elems, fn, i, key[ i ], true, emptyGet, raw );
    			}

    		// Sets one value
    		} else if ( value !== undefined ) {
    			chainable = true;

    			if ( !isFunction( value ) ) {
    				raw = true;
    			}

    			if ( bulk ) {

    				// Bulk operations run against the entire set
    				if ( raw ) {
    					fn.call( elems, value );
    					fn = null;

    				// ...except when executing function values
    				} else {
    					bulk = fn;
    					fn = function( elem, _key, value ) {
    						return bulk.call( jQuery( elem ), value );
    					};
    				}
    			}

    			if ( fn ) {
    				for ( ; i < len; i++ ) {
    					fn(
    						elems[ i ], key, raw ?
    							value :
    							value.call( elems[ i ], i, fn( elems[ i ], key ) )
    					);
    				}
    			}
    		}

    		if ( chainable ) {
    			return elems;
    		}

    		// Gets
    		if ( bulk ) {
    			return fn.call( elems );
    		}

    		return len ? fn( elems[ 0 ], key ) : emptyGet;
    	};


    	// Matches dashed string for camelizing
    	var rmsPrefix = /^-ms-/,
    		rdashAlpha = /-([a-z])/g;

    	// Used by camelCase as callback to replace()
    	function fcamelCase( _all, letter ) {
    		return letter.toUpperCase();
    	}

    	// Convert dashed to camelCase; used by the css and data modules
    	// Support: IE <=9 - 11, Edge 12 - 15
    	// Microsoft forgot to hump their vendor prefix (trac-9572)
    	function camelCase( string ) {
    		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    	}
    	var acceptData = function( owner ) {

    		// Accepts only:
    		//  - Node
    		//    - Node.ELEMENT_NODE
    		//    - Node.DOCUMENT_NODE
    		//  - Object
    		//    - Any
    		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
    	};




    	function Data() {
    		this.expando = jQuery.expando + Data.uid++;
    	}

    	Data.uid = 1;

    	Data.prototype = {

    		cache: function( owner ) {

    			// Check if the owner object already has a cache
    			var value = owner[ this.expando ];

    			// If not, create one
    			if ( !value ) {
    				value = {};

    				// We can accept data for non-element nodes in modern browsers,
    				// but we should not, see trac-8335.
    				// Always return an empty object.
    				if ( acceptData( owner ) ) {

    					// If it is a node unlikely to be stringify-ed or looped over
    					// use plain assignment
    					if ( owner.nodeType ) {
    						owner[ this.expando ] = value;

    					// Otherwise secure it in a non-enumerable property
    					// configurable must be true to allow the property to be
    					// deleted when data is removed
    					} else {
    						Object.defineProperty( owner, this.expando, {
    							value: value,
    							configurable: true
    						} );
    					}
    				}
    			}

    			return value;
    		},
    		set: function( owner, data, value ) {
    			var prop,
    				cache = this.cache( owner );

    			// Handle: [ owner, key, value ] args
    			// Always use camelCase key (gh-2257)
    			if ( typeof data === "string" ) {
    				cache[ camelCase( data ) ] = value;

    			// Handle: [ owner, { properties } ] args
    			} else {

    				// Copy the properties one-by-one to the cache object
    				for ( prop in data ) {
    					cache[ camelCase( prop ) ] = data[ prop ];
    				}
    			}
    			return cache;
    		},
    		get: function( owner, key ) {
    			return key === undefined ?
    				this.cache( owner ) :

    				// Always use camelCase key (gh-2257)
    				owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
    		},
    		access: function( owner, key, value ) {

    			// In cases where either:
    			//
    			//   1. No key was specified
    			//   2. A string key was specified, but no value provided
    			//
    			// Take the "read" path and allow the get method to determine
    			// which value to return, respectively either:
    			//
    			//   1. The entire cache object
    			//   2. The data stored at the key
    			//
    			if ( key === undefined ||
    					( ( key && typeof key === "string" ) && value === undefined ) ) {

    				return this.get( owner, key );
    			}

    			// When the key is not a string, or both a key and value
    			// are specified, set or extend (existing objects) with either:
    			//
    			//   1. An object of properties
    			//   2. A key and value
    			//
    			this.set( owner, key, value );

    			// Since the "set" path can have two possible entry points
    			// return the expected data based on which path was taken[*]
    			return value !== undefined ? value : key;
    		},
    		remove: function( owner, key ) {
    			var i,
    				cache = owner[ this.expando ];

    			if ( cache === undefined ) {
    				return;
    			}

    			if ( key !== undefined ) {

    				// Support array or space separated string of keys
    				if ( Array.isArray( key ) ) {

    					// If key is an array of keys...
    					// We always set camelCase keys, so remove that.
    					key = key.map( camelCase );
    				} else {
    					key = camelCase( key );

    					// If a key with the spaces exists, use it.
    					// Otherwise, create an array by matching non-whitespace
    					key = key in cache ?
    						[ key ] :
    						( key.match( rnothtmlwhite ) || [] );
    				}

    				i = key.length;

    				while ( i-- ) {
    					delete cache[ key[ i ] ];
    				}
    			}

    			// Remove the expando if there's no more data
    			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

    				// Support: Chrome <=35 - 45
    				// Webkit & Blink performance suffers when deleting properties
    				// from DOM nodes, so set to undefined instead
    				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
    				if ( owner.nodeType ) {
    					owner[ this.expando ] = undefined;
    				} else {
    					delete owner[ this.expando ];
    				}
    			}
    		},
    		hasData: function( owner ) {
    			var cache = owner[ this.expando ];
    			return cache !== undefined && !jQuery.isEmptyObject( cache );
    		}
    	};
    	var dataPriv = new Data();

    	var dataUser = new Data();



    	//	Implementation Summary
    	//
    	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
    	//	2. Improve the module's maintainability by reducing the storage
    	//		paths to a single mechanism.
    	//	3. Use the same single mechanism to support "private" and "user" data.
    	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
    	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
    	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

    	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    		rmultiDash = /[A-Z]/g;

    	function getData( data ) {
    		if ( data === "true" ) {
    			return true;
    		}

    		if ( data === "false" ) {
    			return false;
    		}

    		if ( data === "null" ) {
    			return null;
    		}

    		// Only convert to a number if it doesn't change the string
    		if ( data === +data + "" ) {
    			return +data;
    		}

    		if ( rbrace.test( data ) ) {
    			return JSON.parse( data );
    		}

    		return data;
    	}

    	function dataAttr( elem, key, data ) {
    		var name;

    		// If nothing was found internally, try to fetch any
    		// data from the HTML5 data-* attribute
    		if ( data === undefined && elem.nodeType === 1 ) {
    			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
    			data = elem.getAttribute( name );

    			if ( typeof data === "string" ) {
    				try {
    					data = getData( data );
    				} catch ( e ) {}

    				// Make sure we set the data so it isn't changed later
    				dataUser.set( elem, key, data );
    			} else {
    				data = undefined;
    			}
    		}
    		return data;
    	}

    	jQuery.extend( {
    		hasData: function( elem ) {
    			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
    		},

    		data: function( elem, name, data ) {
    			return dataUser.access( elem, name, data );
    		},

    		removeData: function( elem, name ) {
    			dataUser.remove( elem, name );
    		},

    		// TODO: Now that all calls to _data and _removeData have been replaced
    		// with direct calls to dataPriv methods, these can be deprecated.
    		_data: function( elem, name, data ) {
    			return dataPriv.access( elem, name, data );
    		},

    		_removeData: function( elem, name ) {
    			dataPriv.remove( elem, name );
    		}
    	} );

    	jQuery.fn.extend( {
    		data: function( key, value ) {
    			var i, name, data,
    				elem = this[ 0 ],
    				attrs = elem && elem.attributes;

    			// Gets all values
    			if ( key === undefined ) {
    				if ( this.length ) {
    					data = dataUser.get( elem );

    					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
    						i = attrs.length;
    						while ( i-- ) {

    							// Support: IE 11 only
    							// The attrs elements can be null (trac-14894)
    							if ( attrs[ i ] ) {
    								name = attrs[ i ].name;
    								if ( name.indexOf( "data-" ) === 0 ) {
    									name = camelCase( name.slice( 5 ) );
    									dataAttr( elem, name, data[ name ] );
    								}
    							}
    						}
    						dataPriv.set( elem, "hasDataAttrs", true );
    					}
    				}

    				return data;
    			}

    			// Sets multiple values
    			if ( typeof key === "object" ) {
    				return this.each( function() {
    					dataUser.set( this, key );
    				} );
    			}

    			return access( this, function( value ) {
    				var data;

    				// The calling jQuery object (element matches) is not empty
    				// (and therefore has an element appears at this[ 0 ]) and the
    				// `value` parameter was not undefined. An empty jQuery object
    				// will result in `undefined` for elem = this[ 0 ] which will
    				// throw an exception if an attempt to read a data cache is made.
    				if ( elem && value === undefined ) {

    					// Attempt to get data from the cache
    					// The key will always be camelCased in Data
    					data = dataUser.get( elem, key );
    					if ( data !== undefined ) {
    						return data;
    					}

    					// Attempt to "discover" the data in
    					// HTML5 custom data-* attrs
    					data = dataAttr( elem, key );
    					if ( data !== undefined ) {
    						return data;
    					}

    					// We tried really hard, but the data doesn't exist.
    					return;
    				}

    				// Set the data...
    				this.each( function() {

    					// We always store the camelCased key
    					dataUser.set( this, key, value );
    				} );
    			}, null, value, arguments.length > 1, null, true );
    		},

    		removeData: function( key ) {
    			return this.each( function() {
    				dataUser.remove( this, key );
    			} );
    		}
    	} );


    	jQuery.extend( {
    		queue: function( elem, type, data ) {
    			var queue;

    			if ( elem ) {
    				type = ( type || "fx" ) + "queue";
    				queue = dataPriv.get( elem, type );

    				// Speed up dequeue by getting out quickly if this is just a lookup
    				if ( data ) {
    					if ( !queue || Array.isArray( data ) ) {
    						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
    					} else {
    						queue.push( data );
    					}
    				}
    				return queue || [];
    			}
    		},

    		dequeue: function( elem, type ) {
    			type = type || "fx";

    			var queue = jQuery.queue( elem, type ),
    				startLength = queue.length,
    				fn = queue.shift(),
    				hooks = jQuery._queueHooks( elem, type ),
    				next = function() {
    					jQuery.dequeue( elem, type );
    				};

    			// If the fx queue is dequeued, always remove the progress sentinel
    			if ( fn === "inprogress" ) {
    				fn = queue.shift();
    				startLength--;
    			}

    			if ( fn ) {

    				// Add a progress sentinel to prevent the fx queue from being
    				// automatically dequeued
    				if ( type === "fx" ) {
    					queue.unshift( "inprogress" );
    				}

    				// Clear up the last queue stop function
    				delete hooks.stop;
    				fn.call( elem, next, hooks );
    			}

    			if ( !startLength && hooks ) {
    				hooks.empty.fire();
    			}
    		},

    		// Not public - generate a queueHooks object, or return the current one
    		_queueHooks: function( elem, type ) {
    			var key = type + "queueHooks";
    			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
    				empty: jQuery.Callbacks( "once memory" ).add( function() {
    					dataPriv.remove( elem, [ type + "queue", key ] );
    				} )
    			} );
    		}
    	} );

    	jQuery.fn.extend( {
    		queue: function( type, data ) {
    			var setter = 2;

    			if ( typeof type !== "string" ) {
    				data = type;
    				type = "fx";
    				setter--;
    			}

    			if ( arguments.length < setter ) {
    				return jQuery.queue( this[ 0 ], type );
    			}

    			return data === undefined ?
    				this :
    				this.each( function() {
    					var queue = jQuery.queue( this, type, data );

    					// Ensure a hooks for this queue
    					jQuery._queueHooks( this, type );

    					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
    						jQuery.dequeue( this, type );
    					}
    				} );
    		},
    		dequeue: function( type ) {
    			return this.each( function() {
    				jQuery.dequeue( this, type );
    			} );
    		},
    		clearQueue: function( type ) {
    			return this.queue( type || "fx", [] );
    		},

    		// Get a promise resolved when queues of a certain type
    		// are emptied (fx is the type by default)
    		promise: function( type, obj ) {
    			var tmp,
    				count = 1,
    				defer = jQuery.Deferred(),
    				elements = this,
    				i = this.length,
    				resolve = function() {
    					if ( !( --count ) ) {
    						defer.resolveWith( elements, [ elements ] );
    					}
    				};

    			if ( typeof type !== "string" ) {
    				obj = type;
    				type = undefined;
    			}
    			type = type || "fx";

    			while ( i-- ) {
    				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
    				if ( tmp && tmp.empty ) {
    					count++;
    					tmp.empty.add( resolve );
    				}
    			}
    			resolve();
    			return defer.promise( obj );
    		}
    	} );
    	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

    	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


    	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

    	var documentElement = document.documentElement;



    		var isAttached = function( elem ) {
    				return jQuery.contains( elem.ownerDocument, elem );
    			},
    			composed = { composed: true };

    		// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
    		// Check attachment across shadow DOM boundaries when possible (gh-3504)
    		// Support: iOS 10.0-10.2 only
    		// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
    		// leading to errors. We need to check for `getRootNode`.
    		if ( documentElement.getRootNode ) {
    			isAttached = function( elem ) {
    				return jQuery.contains( elem.ownerDocument, elem ) ||
    					elem.getRootNode( composed ) === elem.ownerDocument;
    			};
    		}
    	var isHiddenWithinTree = function( elem, el ) {

    			// isHiddenWithinTree might be called from jQuery#filter function;
    			// in that case, element will be second argument
    			elem = el || elem;

    			// Inline style trumps all
    			return elem.style.display === "none" ||
    				elem.style.display === "" &&

    				// Otherwise, check computed style
    				// Support: Firefox <=43 - 45
    				// Disconnected elements can have computed display: none, so first confirm that elem is
    				// in the document.
    				isAttached( elem ) &&

    				jQuery.css( elem, "display" ) === "none";
    		};



    	function adjustCSS( elem, prop, valueParts, tween ) {
    		var adjusted, scale,
    			maxIterations = 20,
    			currentValue = tween ?
    				function() {
    					return tween.cur();
    				} :
    				function() {
    					return jQuery.css( elem, prop, "" );
    				},
    			initial = currentValue(),
    			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

    			// Starting value computation is required for potential unit mismatches
    			initialInUnit = elem.nodeType &&
    				( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
    				rcssNum.exec( jQuery.css( elem, prop ) );

    		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

    			// Support: Firefox <=54
    			// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
    			initial = initial / 2;

    			// Trust units reported by jQuery.css
    			unit = unit || initialInUnit[ 3 ];

    			// Iteratively approximate from a nonzero starting point
    			initialInUnit = +initial || 1;

    			while ( maxIterations-- ) {

    				// Evaluate and update our best guess (doubling guesses that zero out).
    				// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
    				jQuery.style( elem, prop, initialInUnit + unit );
    				if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
    					maxIterations = 0;
    				}
    				initialInUnit = initialInUnit / scale;

    			}

    			initialInUnit = initialInUnit * 2;
    			jQuery.style( elem, prop, initialInUnit + unit );

    			// Make sure we update the tween properties later on
    			valueParts = valueParts || [];
    		}

    		if ( valueParts ) {
    			initialInUnit = +initialInUnit || +initial || 0;

    			// Apply relative offset (+=/-=) if specified
    			adjusted = valueParts[ 1 ] ?
    				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
    				+valueParts[ 2 ];
    			if ( tween ) {
    				tween.unit = unit;
    				tween.start = initialInUnit;
    				tween.end = adjusted;
    			}
    		}
    		return adjusted;
    	}


    	var defaultDisplayMap = {};

    	function getDefaultDisplay( elem ) {
    		var temp,
    			doc = elem.ownerDocument,
    			nodeName = elem.nodeName,
    			display = defaultDisplayMap[ nodeName ];

    		if ( display ) {
    			return display;
    		}

    		temp = doc.body.appendChild( doc.createElement( nodeName ) );
    		display = jQuery.css( temp, "display" );

    		temp.parentNode.removeChild( temp );

    		if ( display === "none" ) {
    			display = "block";
    		}
    		defaultDisplayMap[ nodeName ] = display;

    		return display;
    	}

    	function showHide( elements, show ) {
    		var display, elem,
    			values = [],
    			index = 0,
    			length = elements.length;

    		// Determine new display value for elements that need to change
    		for ( ; index < length; index++ ) {
    			elem = elements[ index ];
    			if ( !elem.style ) {
    				continue;
    			}

    			display = elem.style.display;
    			if ( show ) {

    				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
    				// check is required in this first loop unless we have a nonempty display value (either
    				// inline or about-to-be-restored)
    				if ( display === "none" ) {
    					values[ index ] = dataPriv.get( elem, "display" ) || null;
    					if ( !values[ index ] ) {
    						elem.style.display = "";
    					}
    				}
    				if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
    					values[ index ] = getDefaultDisplay( elem );
    				}
    			} else {
    				if ( display !== "none" ) {
    					values[ index ] = "none";

    					// Remember what we're overwriting
    					dataPriv.set( elem, "display", display );
    				}
    			}
    		}

    		// Set the display of the elements in a second loop to avoid constant reflow
    		for ( index = 0; index < length; index++ ) {
    			if ( values[ index ] != null ) {
    				elements[ index ].style.display = values[ index ];
    			}
    		}

    		return elements;
    	}

    	jQuery.fn.extend( {
    		show: function() {
    			return showHide( this, true );
    		},
    		hide: function() {
    			return showHide( this );
    		},
    		toggle: function( state ) {
    			if ( typeof state === "boolean" ) {
    				return state ? this.show() : this.hide();
    			}

    			return this.each( function() {
    				if ( isHiddenWithinTree( this ) ) {
    					jQuery( this ).show();
    				} else {
    					jQuery( this ).hide();
    				}
    			} );
    		}
    	} );
    	var rcheckableType = ( /^(?:checkbox|radio)$/i );

    	var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

    	var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



    	( function() {
    		var fragment = document.createDocumentFragment(),
    			div = fragment.appendChild( document.createElement( "div" ) ),
    			input = document.createElement( "input" );

    		// Support: Android 4.0 - 4.3 only
    		// Check state lost if the name is set (trac-11217)
    		// Support: Windows Web Apps (WWA)
    		// `name` and `type` must use .setAttribute for WWA (trac-14901)
    		input.setAttribute( "type", "radio" );
    		input.setAttribute( "checked", "checked" );
    		input.setAttribute( "name", "t" );

    		div.appendChild( input );

    		// Support: Android <=4.1 only
    		// Older WebKit doesn't clone checked state correctly in fragments
    		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

    		// Support: IE <=11 only
    		// Make sure textarea (and checkbox) defaultValue is properly cloned
    		div.innerHTML = "<textarea>x</textarea>";
    		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

    		// Support: IE <=9 only
    		// IE <=9 replaces <option> tags with their contents when inserted outside of
    		// the select element.
    		div.innerHTML = "<option></option>";
    		support.option = !!div.lastChild;
    	} )();


    	// We have to close these tags to support XHTML (trac-13200)
    	var wrapMap = {

    		// XHTML parsers do not magically insert elements in the
    		// same way that tag soup parsers do. So we cannot shorten
    		// this by omitting <tbody> or other required elements.
    		thead: [ 1, "<table>", "</table>" ],
    		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
    		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

    		_default: [ 0, "", "" ]
    	};

    	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    	wrapMap.th = wrapMap.td;

    	// Support: IE <=9 only
    	if ( !support.option ) {
    		wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
    	}


    	function getAll( context, tag ) {

    		// Support: IE <=9 - 11 only
    		// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
    		var ret;

    		if ( typeof context.getElementsByTagName !== "undefined" ) {
    			ret = context.getElementsByTagName( tag || "*" );

    		} else if ( typeof context.querySelectorAll !== "undefined" ) {
    			ret = context.querySelectorAll( tag || "*" );

    		} else {
    			ret = [];
    		}

    		if ( tag === undefined || tag && nodeName( context, tag ) ) {
    			return jQuery.merge( [ context ], ret );
    		}

    		return ret;
    	}


    	// Mark scripts as having already been evaluated
    	function setGlobalEval( elems, refElements ) {
    		var i = 0,
    			l = elems.length;

    		for ( ; i < l; i++ ) {
    			dataPriv.set(
    				elems[ i ],
    				"globalEval",
    				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
    			);
    		}
    	}


    	var rhtml = /<|&#?\w+;/;

    	function buildFragment( elems, context, scripts, selection, ignored ) {
    		var elem, tmp, tag, wrap, attached, j,
    			fragment = context.createDocumentFragment(),
    			nodes = [],
    			i = 0,
    			l = elems.length;

    		for ( ; i < l; i++ ) {
    			elem = elems[ i ];

    			if ( elem || elem === 0 ) {

    				// Add nodes directly
    				if ( toType( elem ) === "object" ) {

    					// Support: Android <=4.0 only, PhantomJS 1 only
    					// push.apply(_, arraylike) throws on ancient WebKit
    					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

    				// Convert non-html into a text node
    				} else if ( !rhtml.test( elem ) ) {
    					nodes.push( context.createTextNode( elem ) );

    				// Convert html into DOM nodes
    				} else {
    					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

    					// Deserialize a standard representation
    					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
    					wrap = wrapMap[ tag ] || wrapMap._default;
    					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

    					// Descend through wrappers to the right content
    					j = wrap[ 0 ];
    					while ( j-- ) {
    						tmp = tmp.lastChild;
    					}

    					// Support: Android <=4.0 only, PhantomJS 1 only
    					// push.apply(_, arraylike) throws on ancient WebKit
    					jQuery.merge( nodes, tmp.childNodes );

    					// Remember the top-level container
    					tmp = fragment.firstChild;

    					// Ensure the created nodes are orphaned (trac-12392)
    					tmp.textContent = "";
    				}
    			}
    		}

    		// Remove wrapper from fragment
    		fragment.textContent = "";

    		i = 0;
    		while ( ( elem = nodes[ i++ ] ) ) {

    			// Skip elements already in the context collection (trac-4087)
    			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
    				if ( ignored ) {
    					ignored.push( elem );
    				}
    				continue;
    			}

    			attached = isAttached( elem );

    			// Append to fragment
    			tmp = getAll( fragment.appendChild( elem ), "script" );

    			// Preserve script evaluation history
    			if ( attached ) {
    				setGlobalEval( tmp );
    			}

    			// Capture executables
    			if ( scripts ) {
    				j = 0;
    				while ( ( elem = tmp[ j++ ] ) ) {
    					if ( rscriptType.test( elem.type || "" ) ) {
    						scripts.push( elem );
    					}
    				}
    			}
    		}

    		return fragment;
    	}


    	var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

    	function returnTrue() {
    		return true;
    	}

    	function returnFalse() {
    		return false;
    	}

    	// Support: IE <=9 - 11+
    	// focus() and blur() are asynchronous, except when they are no-op.
    	// So expect focus to be synchronous when the element is already active,
    	// and blur to be synchronous when the element is not already active.
    	// (focus and blur are always synchronous in other supported browsers,
    	// this just defines when we can count on it).
    	function expectSync( elem, type ) {
    		return ( elem === safeActiveElement() ) === ( type === "focus" );
    	}

    	// Support: IE <=9 only
    	// Accessing document.activeElement can throw unexpectedly
    	// https://bugs.jquery.com/ticket/13393
    	function safeActiveElement() {
    		try {
    			return document.activeElement;
    		} catch ( err ) { }
    	}

    	function on( elem, types, selector, data, fn, one ) {
    		var origFn, type;

    		// Types can be a map of types/handlers
    		if ( typeof types === "object" ) {

    			// ( types-Object, selector, data )
    			if ( typeof selector !== "string" ) {

    				// ( types-Object, data )
    				data = data || selector;
    				selector = undefined;
    			}
    			for ( type in types ) {
    				on( elem, type, selector, data, types[ type ], one );
    			}
    			return elem;
    		}

    		if ( data == null && fn == null ) {

    			// ( types, fn )
    			fn = selector;
    			data = selector = undefined;
    		} else if ( fn == null ) {
    			if ( typeof selector === "string" ) {

    				// ( types, selector, fn )
    				fn = data;
    				data = undefined;
    			} else {

    				// ( types, data, fn )
    				fn = data;
    				data = selector;
    				selector = undefined;
    			}
    		}
    		if ( fn === false ) {
    			fn = returnFalse;
    		} else if ( !fn ) {
    			return elem;
    		}

    		if ( one === 1 ) {
    			origFn = fn;
    			fn = function( event ) {

    				// Can use an empty set, since event contains the info
    				jQuery().off( event );
    				return origFn.apply( this, arguments );
    			};

    			// Use same guid so caller can remove using origFn
    			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    		}
    		return elem.each( function() {
    			jQuery.event.add( this, types, fn, data, selector );
    		} );
    	}

    	/*
    	 * Helper functions for managing events -- not part of the public interface.
    	 * Props to Dean Edwards' addEvent library for many of the ideas.
    	 */
    	jQuery.event = {

    		global: {},

    		add: function( elem, types, handler, data, selector ) {

    			var handleObjIn, eventHandle, tmp,
    				events, t, handleObj,
    				special, handlers, type, namespaces, origType,
    				elemData = dataPriv.get( elem );

    			// Only attach events to objects that accept data
    			if ( !acceptData( elem ) ) {
    				return;
    			}

    			// Caller can pass in an object of custom data in lieu of the handler
    			if ( handler.handler ) {
    				handleObjIn = handler;
    				handler = handleObjIn.handler;
    				selector = handleObjIn.selector;
    			}

    			// Ensure that invalid selectors throw exceptions at attach time
    			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
    			if ( selector ) {
    				jQuery.find.matchesSelector( documentElement, selector );
    			}

    			// Make sure that the handler has a unique ID, used to find/remove it later
    			if ( !handler.guid ) {
    				handler.guid = jQuery.guid++;
    			}

    			// Init the element's event structure and main handler, if this is the first
    			if ( !( events = elemData.events ) ) {
    				events = elemData.events = Object.create( null );
    			}
    			if ( !( eventHandle = elemData.handle ) ) {
    				eventHandle = elemData.handle = function( e ) {

    					// Discard the second event of a jQuery.event.trigger() and
    					// when an event is called after a page has unloaded
    					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
    						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
    				};
    			}

    			// Handle multiple events separated by a space
    			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
    			t = types.length;
    			while ( t-- ) {
    				tmp = rtypenamespace.exec( types[ t ] ) || [];
    				type = origType = tmp[ 1 ];
    				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

    				// There *must* be a type, no attaching namespace-only handlers
    				if ( !type ) {
    					continue;
    				}

    				// If event changes its type, use the special event handlers for the changed type
    				special = jQuery.event.special[ type ] || {};

    				// If selector defined, determine special event api type, otherwise given type
    				type = ( selector ? special.delegateType : special.bindType ) || type;

    				// Update special based on newly reset type
    				special = jQuery.event.special[ type ] || {};

    				// handleObj is passed to all event handlers
    				handleObj = jQuery.extend( {
    					type: type,
    					origType: origType,
    					data: data,
    					handler: handler,
    					guid: handler.guid,
    					selector: selector,
    					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
    					namespace: namespaces.join( "." )
    				}, handleObjIn );

    				// Init the event handler queue if we're the first
    				if ( !( handlers = events[ type ] ) ) {
    					handlers = events[ type ] = [];
    					handlers.delegateCount = 0;

    					// Only use addEventListener if the special events handler returns false
    					if ( !special.setup ||
    						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

    						if ( elem.addEventListener ) {
    							elem.addEventListener( type, eventHandle );
    						}
    					}
    				}

    				if ( special.add ) {
    					special.add.call( elem, handleObj );

    					if ( !handleObj.handler.guid ) {
    						handleObj.handler.guid = handler.guid;
    					}
    				}

    				// Add to the element's handler list, delegates in front
    				if ( selector ) {
    					handlers.splice( handlers.delegateCount++, 0, handleObj );
    				} else {
    					handlers.push( handleObj );
    				}

    				// Keep track of which events have ever been used, for event optimization
    				jQuery.event.global[ type ] = true;
    			}

    		},

    		// Detach an event or set of events from an element
    		remove: function( elem, types, handler, selector, mappedTypes ) {

    			var j, origCount, tmp,
    				events, t, handleObj,
    				special, handlers, type, namespaces, origType,
    				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

    			if ( !elemData || !( events = elemData.events ) ) {
    				return;
    			}

    			// Once for each type.namespace in types; type may be omitted
    			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
    			t = types.length;
    			while ( t-- ) {
    				tmp = rtypenamespace.exec( types[ t ] ) || [];
    				type = origType = tmp[ 1 ];
    				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

    				// Unbind all events (on this namespace, if provided) for the element
    				if ( !type ) {
    					for ( type in events ) {
    						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
    					}
    					continue;
    				}

    				special = jQuery.event.special[ type ] || {};
    				type = ( selector ? special.delegateType : special.bindType ) || type;
    				handlers = events[ type ] || [];
    				tmp = tmp[ 2 ] &&
    					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

    				// Remove matching events
    				origCount = j = handlers.length;
    				while ( j-- ) {
    					handleObj = handlers[ j ];

    					if ( ( mappedTypes || origType === handleObj.origType ) &&
    						( !handler || handler.guid === handleObj.guid ) &&
    						( !tmp || tmp.test( handleObj.namespace ) ) &&
    						( !selector || selector === handleObj.selector ||
    							selector === "**" && handleObj.selector ) ) {
    						handlers.splice( j, 1 );

    						if ( handleObj.selector ) {
    							handlers.delegateCount--;
    						}
    						if ( special.remove ) {
    							special.remove.call( elem, handleObj );
    						}
    					}
    				}

    				// Remove generic event handler if we removed something and no more handlers exist
    				// (avoids potential for endless recursion during removal of special event handlers)
    				if ( origCount && !handlers.length ) {
    					if ( !special.teardown ||
    						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

    						jQuery.removeEvent( elem, type, elemData.handle );
    					}

    					delete events[ type ];
    				}
    			}

    			// Remove data and the expando if it's no longer used
    			if ( jQuery.isEmptyObject( events ) ) {
    				dataPriv.remove( elem, "handle events" );
    			}
    		},

    		dispatch: function( nativeEvent ) {

    			var i, j, ret, matched, handleObj, handlerQueue,
    				args = new Array( arguments.length ),

    				// Make a writable jQuery.Event from the native event object
    				event = jQuery.event.fix( nativeEvent ),

    				handlers = (
    					dataPriv.get( this, "events" ) || Object.create( null )
    				)[ event.type ] || [],
    				special = jQuery.event.special[ event.type ] || {};

    			// Use the fix-ed jQuery.Event rather than the (read-only) native event
    			args[ 0 ] = event;

    			for ( i = 1; i < arguments.length; i++ ) {
    				args[ i ] = arguments[ i ];
    			}

    			event.delegateTarget = this;

    			// Call the preDispatch hook for the mapped type, and let it bail if desired
    			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
    				return;
    			}

    			// Determine handlers
    			handlerQueue = jQuery.event.handlers.call( this, event, handlers );

    			// Run delegates first; they may want to stop propagation beneath us
    			i = 0;
    			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
    				event.currentTarget = matched.elem;

    				j = 0;
    				while ( ( handleObj = matched.handlers[ j++ ] ) &&
    					!event.isImmediatePropagationStopped() ) {

    					// If the event is namespaced, then each handler is only invoked if it is
    					// specially universal or its namespaces are a superset of the event's.
    					if ( !event.rnamespace || handleObj.namespace === false ||
    						event.rnamespace.test( handleObj.namespace ) ) {

    						event.handleObj = handleObj;
    						event.data = handleObj.data;

    						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
    							handleObj.handler ).apply( matched.elem, args );

    						if ( ret !== undefined ) {
    							if ( ( event.result = ret ) === false ) {
    								event.preventDefault();
    								event.stopPropagation();
    							}
    						}
    					}
    				}
    			}

    			// Call the postDispatch hook for the mapped type
    			if ( special.postDispatch ) {
    				special.postDispatch.call( this, event );
    			}

    			return event.result;
    		},

    		handlers: function( event, handlers ) {
    			var i, handleObj, sel, matchedHandlers, matchedSelectors,
    				handlerQueue = [],
    				delegateCount = handlers.delegateCount,
    				cur = event.target;

    			// Find delegate handlers
    			if ( delegateCount &&

    				// Support: IE <=9
    				// Black-hole SVG <use> instance trees (trac-13180)
    				cur.nodeType &&

    				// Support: Firefox <=42
    				// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
    				// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
    				// Support: IE 11 only
    				// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
    				!( event.type === "click" && event.button >= 1 ) ) {

    				for ( ; cur !== this; cur = cur.parentNode || this ) {

    					// Don't check non-elements (trac-13208)
    					// Don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
    					if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
    						matchedHandlers = [];
    						matchedSelectors = {};
    						for ( i = 0; i < delegateCount; i++ ) {
    							handleObj = handlers[ i ];

    							// Don't conflict with Object.prototype properties (trac-13203)
    							sel = handleObj.selector + " ";

    							if ( matchedSelectors[ sel ] === undefined ) {
    								matchedSelectors[ sel ] = handleObj.needsContext ?
    									jQuery( sel, this ).index( cur ) > -1 :
    									jQuery.find( sel, this, null, [ cur ] ).length;
    							}
    							if ( matchedSelectors[ sel ] ) {
    								matchedHandlers.push( handleObj );
    							}
    						}
    						if ( matchedHandlers.length ) {
    							handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
    						}
    					}
    				}
    			}

    			// Add the remaining (directly-bound) handlers
    			cur = this;
    			if ( delegateCount < handlers.length ) {
    				handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
    			}

    			return handlerQueue;
    		},

    		addProp: function( name, hook ) {
    			Object.defineProperty( jQuery.Event.prototype, name, {
    				enumerable: true,
    				configurable: true,

    				get: isFunction( hook ) ?
    					function() {
    						if ( this.originalEvent ) {
    							return hook( this.originalEvent );
    						}
    					} :
    					function() {
    						if ( this.originalEvent ) {
    							return this.originalEvent[ name ];
    						}
    					},

    				set: function( value ) {
    					Object.defineProperty( this, name, {
    						enumerable: true,
    						configurable: true,
    						writable: true,
    						value: value
    					} );
    				}
    			} );
    		},

    		fix: function( originalEvent ) {
    			return originalEvent[ jQuery.expando ] ?
    				originalEvent :
    				new jQuery.Event( originalEvent );
    		},

    		special: {
    			load: {

    				// Prevent triggered image.load events from bubbling to window.load
    				noBubble: true
    			},
    			click: {

    				// Utilize native event to ensure correct state for checkable inputs
    				setup: function( data ) {

    					// For mutual compressibility with _default, replace `this` access with a local var.
    					// `|| data` is dead code meant only to preserve the variable through minification.
    					var el = this || data;

    					// Claim the first handler
    					if ( rcheckableType.test( el.type ) &&
    						el.click && nodeName( el, "input" ) ) {

    						// dataPriv.set( el, "click", ... )
    						leverageNative( el, "click", returnTrue );
    					}

    					// Return false to allow normal processing in the caller
    					return false;
    				},
    				trigger: function( data ) {

    					// For mutual compressibility with _default, replace `this` access with a local var.
    					// `|| data` is dead code meant only to preserve the variable through minification.
    					var el = this || data;

    					// Force setup before triggering a click
    					if ( rcheckableType.test( el.type ) &&
    						el.click && nodeName( el, "input" ) ) {

    						leverageNative( el, "click" );
    					}

    					// Return non-false to allow normal event-path propagation
    					return true;
    				},

    				// For cross-browser consistency, suppress native .click() on links
    				// Also prevent it if we're currently inside a leveraged native-event stack
    				_default: function( event ) {
    					var target = event.target;
    					return rcheckableType.test( target.type ) &&
    						target.click && nodeName( target, "input" ) &&
    						dataPriv.get( target, "click" ) ||
    						nodeName( target, "a" );
    				}
    			},

    			beforeunload: {
    				postDispatch: function( event ) {

    					// Support: Firefox 20+
    					// Firefox doesn't alert if the returnValue field is not set.
    					if ( event.result !== undefined && event.originalEvent ) {
    						event.originalEvent.returnValue = event.result;
    					}
    				}
    			}
    		}
    	};

    	// Ensure the presence of an event listener that handles manually-triggered
    	// synthetic events by interrupting progress until reinvoked in response to
    	// *native* events that it fires directly, ensuring that state changes have
    	// already occurred before other listeners are invoked.
    	function leverageNative( el, type, expectSync ) {

    		// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
    		if ( !expectSync ) {
    			if ( dataPriv.get( el, type ) === undefined ) {
    				jQuery.event.add( el, type, returnTrue );
    			}
    			return;
    		}

    		// Register the controller as a special universal handler for all event namespaces
    		dataPriv.set( el, type, false );
    		jQuery.event.add( el, type, {
    			namespace: false,
    			handler: function( event ) {
    				var notAsync, result,
    					saved = dataPriv.get( this, type );

    				if ( ( event.isTrigger & 1 ) && this[ type ] ) {

    					// Interrupt processing of the outer synthetic .trigger()ed event
    					// Saved data should be false in such cases, but might be a leftover capture object
    					// from an async native handler (gh-4350)
    					if ( !saved.length ) {

    						// Store arguments for use when handling the inner native event
    						// There will always be at least one argument (an event object), so this array
    						// will not be confused with a leftover capture object.
    						saved = slice.call( arguments );
    						dataPriv.set( this, type, saved );

    						// Trigger the native event and capture its result
    						// Support: IE <=9 - 11+
    						// focus() and blur() are asynchronous
    						notAsync = expectSync( this, type );
    						this[ type ]();
    						result = dataPriv.get( this, type );
    						if ( saved !== result || notAsync ) {
    							dataPriv.set( this, type, false );
    						} else {
    							result = {};
    						}
    						if ( saved !== result ) {

    							// Cancel the outer synthetic event
    							event.stopImmediatePropagation();
    							event.preventDefault();

    							// Support: Chrome 86+
    							// In Chrome, if an element having a focusout handler is blurred by
    							// clicking outside of it, it invokes the handler synchronously. If
    							// that handler calls `.remove()` on the element, the data is cleared,
    							// leaving `result` undefined. We need to guard against this.
    							return result && result.value;
    						}

    					// If this is an inner synthetic event for an event with a bubbling surrogate
    					// (focus or blur), assume that the surrogate already propagated from triggering the
    					// native event and prevent that from happening again here.
    					// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
    					// bubbling surrogate propagates *after* the non-bubbling base), but that seems
    					// less bad than duplication.
    					} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
    						event.stopPropagation();
    					}

    				// If this is a native event triggered above, everything is now in order
    				// Fire an inner synthetic event with the original arguments
    				} else if ( saved.length ) {

    					// ...and capture the result
    					dataPriv.set( this, type, {
    						value: jQuery.event.trigger(

    							// Support: IE <=9 - 11+
    							// Extend with the prototype to reset the above stopImmediatePropagation()
    							jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
    							saved.slice( 1 ),
    							this
    						)
    					} );

    					// Abort handling of the native event
    					event.stopImmediatePropagation();
    				}
    			}
    		} );
    	}

    	jQuery.removeEvent = function( elem, type, handle ) {

    		// This "if" is needed for plain objects
    		if ( elem.removeEventListener ) {
    			elem.removeEventListener( type, handle );
    		}
    	};

    	jQuery.Event = function( src, props ) {

    		// Allow instantiation without the 'new' keyword
    		if ( !( this instanceof jQuery.Event ) ) {
    			return new jQuery.Event( src, props );
    		}

    		// Event object
    		if ( src && src.type ) {
    			this.originalEvent = src;
    			this.type = src.type;

    			// Events bubbling up the document may have been marked as prevented
    			// by a handler lower down the tree; reflect the correct value.
    			this.isDefaultPrevented = src.defaultPrevented ||
    					src.defaultPrevented === undefined &&

    					// Support: Android <=2.3 only
    					src.returnValue === false ?
    				returnTrue :
    				returnFalse;

    			// Create target properties
    			// Support: Safari <=6 - 7 only
    			// Target should not be a text node (trac-504, trac-13143)
    			this.target = ( src.target && src.target.nodeType === 3 ) ?
    				src.target.parentNode :
    				src.target;

    			this.currentTarget = src.currentTarget;
    			this.relatedTarget = src.relatedTarget;

    		// Event type
    		} else {
    			this.type = src;
    		}

    		// Put explicitly provided properties onto the event object
    		if ( props ) {
    			jQuery.extend( this, props );
    		}

    		// Create a timestamp if incoming event doesn't have one
    		this.timeStamp = src && src.timeStamp || Date.now();

    		// Mark it as fixed
    		this[ jQuery.expando ] = true;
    	};

    	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    	jQuery.Event.prototype = {
    		constructor: jQuery.Event,
    		isDefaultPrevented: returnFalse,
    		isPropagationStopped: returnFalse,
    		isImmediatePropagationStopped: returnFalse,
    		isSimulated: false,

    		preventDefault: function() {
    			var e = this.originalEvent;

    			this.isDefaultPrevented = returnTrue;

    			if ( e && !this.isSimulated ) {
    				e.preventDefault();
    			}
    		},
    		stopPropagation: function() {
    			var e = this.originalEvent;

    			this.isPropagationStopped = returnTrue;

    			if ( e && !this.isSimulated ) {
    				e.stopPropagation();
    			}
    		},
    		stopImmediatePropagation: function() {
    			var e = this.originalEvent;

    			this.isImmediatePropagationStopped = returnTrue;

    			if ( e && !this.isSimulated ) {
    				e.stopImmediatePropagation();
    			}

    			this.stopPropagation();
    		}
    	};

    	// Includes all common event props including KeyEvent and MouseEvent specific props
    	jQuery.each( {
    		altKey: true,
    		bubbles: true,
    		cancelable: true,
    		changedTouches: true,
    		ctrlKey: true,
    		detail: true,
    		eventPhase: true,
    		metaKey: true,
    		pageX: true,
    		pageY: true,
    		shiftKey: true,
    		view: true,
    		"char": true,
    		code: true,
    		charCode: true,
    		key: true,
    		keyCode: true,
    		button: true,
    		buttons: true,
    		clientX: true,
    		clientY: true,
    		offsetX: true,
    		offsetY: true,
    		pointerId: true,
    		pointerType: true,
    		screenX: true,
    		screenY: true,
    		targetTouches: true,
    		toElement: true,
    		touches: true,
    		which: true
    	}, jQuery.event.addProp );

    	jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
    		jQuery.event.special[ type ] = {

    			// Utilize native event if possible so blur/focus sequence is correct
    			setup: function() {

    				// Claim the first handler
    				// dataPriv.set( this, "focus", ... )
    				// dataPriv.set( this, "blur", ... )
    				leverageNative( this, type, expectSync );

    				// Return false to allow normal processing in the caller
    				return false;
    			},
    			trigger: function() {

    				// Force setup before trigger
    				leverageNative( this, type );

    				// Return non-false to allow normal event-path propagation
    				return true;
    			},

    			// Suppress native focus or blur if we're currently inside
    			// a leveraged native-event stack
    			_default: function( event ) {
    				return dataPriv.get( event.target, type );
    			},

    			delegateType: delegateType
    		};
    	} );

    	// Create mouseenter/leave events using mouseover/out and event-time checks
    	// so that event delegation works in jQuery.
    	// Do the same for pointerenter/pointerleave and pointerover/pointerout
    	//
    	// Support: Safari 7 only
    	// Safari sends mouseenter too often; see:
    	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
    	// for the description of the bug (it existed in older Chrome versions as well).
    	jQuery.each( {
    		mouseenter: "mouseover",
    		mouseleave: "mouseout",
    		pointerenter: "pointerover",
    		pointerleave: "pointerout"
    	}, function( orig, fix ) {
    		jQuery.event.special[ orig ] = {
    			delegateType: fix,
    			bindType: fix,

    			handle: function( event ) {
    				var ret,
    					target = this,
    					related = event.relatedTarget,
    					handleObj = event.handleObj;

    				// For mouseenter/leave call the handler if related is outside the target.
    				// NB: No relatedTarget if the mouse left/entered the browser window
    				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
    					event.type = handleObj.origType;
    					ret = handleObj.handler.apply( this, arguments );
    					event.type = fix;
    				}
    				return ret;
    			}
    		};
    	} );

    	jQuery.fn.extend( {

    		on: function( types, selector, data, fn ) {
    			return on( this, types, selector, data, fn );
    		},
    		one: function( types, selector, data, fn ) {
    			return on( this, types, selector, data, fn, 1 );
    		},
    		off: function( types, selector, fn ) {
    			var handleObj, type;
    			if ( types && types.preventDefault && types.handleObj ) {

    				// ( event )  dispatched jQuery.Event
    				handleObj = types.handleObj;
    				jQuery( types.delegateTarget ).off(
    					handleObj.namespace ?
    						handleObj.origType + "." + handleObj.namespace :
    						handleObj.origType,
    					handleObj.selector,
    					handleObj.handler
    				);
    				return this;
    			}
    			if ( typeof types === "object" ) {

    				// ( types-object [, selector] )
    				for ( type in types ) {
    					this.off( type, selector, types[ type ] );
    				}
    				return this;
    			}
    			if ( selector === false || typeof selector === "function" ) {

    				// ( types [, fn] )
    				fn = selector;
    				selector = undefined;
    			}
    			if ( fn === false ) {
    				fn = returnFalse;
    			}
    			return this.each( function() {
    				jQuery.event.remove( this, types, fn, selector );
    			} );
    		}
    	} );


    	var

    		// Support: IE <=10 - 11, Edge 12 - 13 only
    		// In IE/Edge using regex groups here causes severe slowdowns.
    		// See https://connect.microsoft.com/IE/feedback/details/1736512/
    		rnoInnerhtml = /<script|<style|<link/i,

    		// checked="checked" or checked
    		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

    		rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

    	// Prefer a tbody over its parent table for containing new rows
    	function manipulationTarget( elem, content ) {
    		if ( nodeName( elem, "table" ) &&
    			nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

    			return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
    		}

    		return elem;
    	}

    	// Replace/restore the type attribute of script elements for safe DOM manipulation
    	function disableScript( elem ) {
    		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
    		return elem;
    	}
    	function restoreScript( elem ) {
    		if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
    			elem.type = elem.type.slice( 5 );
    		} else {
    			elem.removeAttribute( "type" );
    		}

    		return elem;
    	}

    	function cloneCopyEvent( src, dest ) {
    		var i, l, type, pdataOld, udataOld, udataCur, events;

    		if ( dest.nodeType !== 1 ) {
    			return;
    		}

    		// 1. Copy private data: events, handlers, etc.
    		if ( dataPriv.hasData( src ) ) {
    			pdataOld = dataPriv.get( src );
    			events = pdataOld.events;

    			if ( events ) {
    				dataPriv.remove( dest, "handle events" );

    				for ( type in events ) {
    					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
    						jQuery.event.add( dest, type, events[ type ][ i ] );
    					}
    				}
    			}
    		}

    		// 2. Copy user data
    		if ( dataUser.hasData( src ) ) {
    			udataOld = dataUser.access( src );
    			udataCur = jQuery.extend( {}, udataOld );

    			dataUser.set( dest, udataCur );
    		}
    	}

    	// Fix IE bugs, see support tests
    	function fixInput( src, dest ) {
    		var nodeName = dest.nodeName.toLowerCase();

    		// Fails to persist the checked state of a cloned checkbox or radio button.
    		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
    			dest.checked = src.checked;

    		// Fails to return the selected option to the default selected state when cloning options
    		} else if ( nodeName === "input" || nodeName === "textarea" ) {
    			dest.defaultValue = src.defaultValue;
    		}
    	}

    	function domManip( collection, args, callback, ignored ) {

    		// Flatten any nested arrays
    		args = flat( args );

    		var fragment, first, scripts, hasScripts, node, doc,
    			i = 0,
    			l = collection.length,
    			iNoClone = l - 1,
    			value = args[ 0 ],
    			valueIsFunction = isFunction( value );

    		// We can't cloneNode fragments that contain checked, in WebKit
    		if ( valueIsFunction ||
    				( l > 1 && typeof value === "string" &&
    					!support.checkClone && rchecked.test( value ) ) ) {
    			return collection.each( function( index ) {
    				var self = collection.eq( index );
    				if ( valueIsFunction ) {
    					args[ 0 ] = value.call( this, index, self.html() );
    				}
    				domManip( self, args, callback, ignored );
    			} );
    		}

    		if ( l ) {
    			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
    			first = fragment.firstChild;

    			if ( fragment.childNodes.length === 1 ) {
    				fragment = first;
    			}

    			// Require either new content or an interest in ignored elements to invoke the callback
    			if ( first || ignored ) {
    				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
    				hasScripts = scripts.length;

    				// Use the original fragment for the last item
    				// instead of the first because it can end up
    				// being emptied incorrectly in certain situations (trac-8070).
    				for ( ; i < l; i++ ) {
    					node = fragment;

    					if ( i !== iNoClone ) {
    						node = jQuery.clone( node, true, true );

    						// Keep references to cloned scripts for later restoration
    						if ( hasScripts ) {

    							// Support: Android <=4.0 only, PhantomJS 1 only
    							// push.apply(_, arraylike) throws on ancient WebKit
    							jQuery.merge( scripts, getAll( node, "script" ) );
    						}
    					}

    					callback.call( collection[ i ], node, i );
    				}

    				if ( hasScripts ) {
    					doc = scripts[ scripts.length - 1 ].ownerDocument;

    					// Reenable scripts
    					jQuery.map( scripts, restoreScript );

    					// Evaluate executable scripts on first document insertion
    					for ( i = 0; i < hasScripts; i++ ) {
    						node = scripts[ i ];
    						if ( rscriptType.test( node.type || "" ) &&
    							!dataPriv.access( node, "globalEval" ) &&
    							jQuery.contains( doc, node ) ) {

    							if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

    								// Optional AJAX dependency, but won't run scripts if not present
    								if ( jQuery._evalUrl && !node.noModule ) {
    									jQuery._evalUrl( node.src, {
    										nonce: node.nonce || node.getAttribute( "nonce" )
    									}, doc );
    								}
    							} else {

    								// Unwrap a CDATA section containing script contents. This shouldn't be
    								// needed as in XML documents they're already not visible when
    								// inspecting element contents and in HTML documents they have no
    								// meaning but we're preserving that logic for backwards compatibility.
    								// This will be removed completely in 4.0. See gh-4904.
    								DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
    							}
    						}
    					}
    				}
    			}
    		}

    		return collection;
    	}

    	function remove( elem, selector, keepData ) {
    		var node,
    			nodes = selector ? jQuery.filter( selector, elem ) : elem,
    			i = 0;

    		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
    			if ( !keepData && node.nodeType === 1 ) {
    				jQuery.cleanData( getAll( node ) );
    			}

    			if ( node.parentNode ) {
    				if ( keepData && isAttached( node ) ) {
    					setGlobalEval( getAll( node, "script" ) );
    				}
    				node.parentNode.removeChild( node );
    			}
    		}

    		return elem;
    	}

    	jQuery.extend( {
    		htmlPrefilter: function( html ) {
    			return html;
    		},

    		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
    			var i, l, srcElements, destElements,
    				clone = elem.cloneNode( true ),
    				inPage = isAttached( elem );

    			// Fix IE cloning issues
    			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
    					!jQuery.isXMLDoc( elem ) ) {

    				// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
    				destElements = getAll( clone );
    				srcElements = getAll( elem );

    				for ( i = 0, l = srcElements.length; i < l; i++ ) {
    					fixInput( srcElements[ i ], destElements[ i ] );
    				}
    			}

    			// Copy the events from the original to the clone
    			if ( dataAndEvents ) {
    				if ( deepDataAndEvents ) {
    					srcElements = srcElements || getAll( elem );
    					destElements = destElements || getAll( clone );

    					for ( i = 0, l = srcElements.length; i < l; i++ ) {
    						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
    					}
    				} else {
    					cloneCopyEvent( elem, clone );
    				}
    			}

    			// Preserve script evaluation history
    			destElements = getAll( clone, "script" );
    			if ( destElements.length > 0 ) {
    				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
    			}

    			// Return the cloned set
    			return clone;
    		},

    		cleanData: function( elems ) {
    			var data, elem, type,
    				special = jQuery.event.special,
    				i = 0;

    			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
    				if ( acceptData( elem ) ) {
    					if ( ( data = elem[ dataPriv.expando ] ) ) {
    						if ( data.events ) {
    							for ( type in data.events ) {
    								if ( special[ type ] ) {
    									jQuery.event.remove( elem, type );

    								// This is a shortcut to avoid jQuery.event.remove's overhead
    								} else {
    									jQuery.removeEvent( elem, type, data.handle );
    								}
    							}
    						}

    						// Support: Chrome <=35 - 45+
    						// Assign undefined instead of using delete, see Data#remove
    						elem[ dataPriv.expando ] = undefined;
    					}
    					if ( elem[ dataUser.expando ] ) {

    						// Support: Chrome <=35 - 45+
    						// Assign undefined instead of using delete, see Data#remove
    						elem[ dataUser.expando ] = undefined;
    					}
    				}
    			}
    		}
    	} );

    	jQuery.fn.extend( {
    		detach: function( selector ) {
    			return remove( this, selector, true );
    		},

    		remove: function( selector ) {
    			return remove( this, selector );
    		},

    		text: function( value ) {
    			return access( this, function( value ) {
    				return value === undefined ?
    					jQuery.text( this ) :
    					this.empty().each( function() {
    						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    							this.textContent = value;
    						}
    					} );
    			}, null, value, arguments.length );
    		},

    		append: function() {
    			return domManip( this, arguments, function( elem ) {
    				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    					var target = manipulationTarget( this, elem );
    					target.appendChild( elem );
    				}
    			} );
    		},

    		prepend: function() {
    			return domManip( this, arguments, function( elem ) {
    				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    					var target = manipulationTarget( this, elem );
    					target.insertBefore( elem, target.firstChild );
    				}
    			} );
    		},

    		before: function() {
    			return domManip( this, arguments, function( elem ) {
    				if ( this.parentNode ) {
    					this.parentNode.insertBefore( elem, this );
    				}
    			} );
    		},

    		after: function() {
    			return domManip( this, arguments, function( elem ) {
    				if ( this.parentNode ) {
    					this.parentNode.insertBefore( elem, this.nextSibling );
    				}
    			} );
    		},

    		empty: function() {
    			var elem,
    				i = 0;

    			for ( ; ( elem = this[ i ] ) != null; i++ ) {
    				if ( elem.nodeType === 1 ) {

    					// Prevent memory leaks
    					jQuery.cleanData( getAll( elem, false ) );

    					// Remove any remaining nodes
    					elem.textContent = "";
    				}
    			}

    			return this;
    		},

    		clone: function( dataAndEvents, deepDataAndEvents ) {
    			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

    			return this.map( function() {
    				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    			} );
    		},

    		html: function( value ) {
    			return access( this, function( value ) {
    				var elem = this[ 0 ] || {},
    					i = 0,
    					l = this.length;

    				if ( value === undefined && elem.nodeType === 1 ) {
    					return elem.innerHTML;
    				}

    				// See if we can take a shortcut and just use innerHTML
    				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
    					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

    					value = jQuery.htmlPrefilter( value );

    					try {
    						for ( ; i < l; i++ ) {
    							elem = this[ i ] || {};

    							// Remove element nodes and prevent memory leaks
    							if ( elem.nodeType === 1 ) {
    								jQuery.cleanData( getAll( elem, false ) );
    								elem.innerHTML = value;
    							}
    						}

    						elem = 0;

    					// If using innerHTML throws an exception, use the fallback method
    					} catch ( e ) {}
    				}

    				if ( elem ) {
    					this.empty().append( value );
    				}
    			}, null, value, arguments.length );
    		},

    		replaceWith: function() {
    			var ignored = [];

    			// Make the changes, replacing each non-ignored context element with the new content
    			return domManip( this, arguments, function( elem ) {
    				var parent = this.parentNode;

    				if ( jQuery.inArray( this, ignored ) < 0 ) {
    					jQuery.cleanData( getAll( this ) );
    					if ( parent ) {
    						parent.replaceChild( elem, this );
    					}
    				}

    			// Force callback invocation
    			}, ignored );
    		}
    	} );

    	jQuery.each( {
    		appendTo: "append",
    		prependTo: "prepend",
    		insertBefore: "before",
    		insertAfter: "after",
    		replaceAll: "replaceWith"
    	}, function( name, original ) {
    		jQuery.fn[ name ] = function( selector ) {
    			var elems,
    				ret = [],
    				insert = jQuery( selector ),
    				last = insert.length - 1,
    				i = 0;

    			for ( ; i <= last; i++ ) {
    				elems = i === last ? this : this.clone( true );
    				jQuery( insert[ i ] )[ original ]( elems );

    				// Support: Android <=4.0 only, PhantomJS 1 only
    				// .get() because push.apply(_, arraylike) throws on ancient WebKit
    				push.apply( ret, elems.get() );
    			}

    			return this.pushStack( ret );
    		};
    	} );
    	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

    	var rcustomProp = /^--/;


    	var getStyles = function( elem ) {

    			// Support: IE <=11 only, Firefox <=30 (trac-15098, trac-14150)
    			// IE throws on elements created in popups
    			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    			var view = elem.ownerDocument.defaultView;

    			if ( !view || !view.opener ) {
    				view = window;
    			}

    			return view.getComputedStyle( elem );
    		};

    	var swap = function( elem, options, callback ) {
    		var ret, name,
    			old = {};

    		// Remember the old values, and insert the new ones
    		for ( name in options ) {
    			old[ name ] = elem.style[ name ];
    			elem.style[ name ] = options[ name ];
    		}

    		ret = callback.call( elem );

    		// Revert the old values
    		for ( name in options ) {
    			elem.style[ name ] = old[ name ];
    		}

    		return ret;
    	};


    	var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );

    	var whitespace = "[\\x20\\t\\r\\n\\f]";


    	var rtrimCSS = new RegExp(
    		"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
    		"g"
    	);




    	( function() {

    		// Executing both pixelPosition & boxSizingReliable tests require only one layout
    		// so they're executed at the same time to save the second computation.
    		function computeStyleTests() {

    			// This is a singleton, we need to execute it only once
    			if ( !div ) {
    				return;
    			}

    			container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
    				"margin-top:1px;padding:0;border:0";
    			div.style.cssText =
    				"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
    				"margin:auto;border:1px;padding:1px;" +
    				"width:60%;top:1%";
    			documentElement.appendChild( container ).appendChild( div );

    			var divStyle = window.getComputedStyle( div );
    			pixelPositionVal = divStyle.top !== "1%";

    			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
    			reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

    			// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
    			// Some styles come back with percentage values, even though they shouldn't
    			div.style.right = "60%";
    			pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

    			// Support: IE 9 - 11 only
    			// Detect misreporting of content dimensions for box-sizing:border-box elements
    			boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

    			// Support: IE 9 only
    			// Detect overflow:scroll screwiness (gh-3699)
    			// Support: Chrome <=64
    			// Don't get tricked when zoom affects offsetWidth (gh-4029)
    			div.style.position = "absolute";
    			scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

    			documentElement.removeChild( container );

    			// Nullify the div so it wouldn't be stored in the memory and
    			// it will also be a sign that checks already performed
    			div = null;
    		}

    		function roundPixelMeasures( measure ) {
    			return Math.round( parseFloat( measure ) );
    		}

    		var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
    			reliableTrDimensionsVal, reliableMarginLeftVal,
    			container = document.createElement( "div" ),
    			div = document.createElement( "div" );

    		// Finish early in limited (non-browser) environments
    		if ( !div.style ) {
    			return;
    		}

    		// Support: IE <=9 - 11 only
    		// Style of cloned element affects source element cloned (trac-8908)
    		div.style.backgroundClip = "content-box";
    		div.cloneNode( true ).style.backgroundClip = "";
    		support.clearCloneStyle = div.style.backgroundClip === "content-box";

    		jQuery.extend( support, {
    			boxSizingReliable: function() {
    				computeStyleTests();
    				return boxSizingReliableVal;
    			},
    			pixelBoxStyles: function() {
    				computeStyleTests();
    				return pixelBoxStylesVal;
    			},
    			pixelPosition: function() {
    				computeStyleTests();
    				return pixelPositionVal;
    			},
    			reliableMarginLeft: function() {
    				computeStyleTests();
    				return reliableMarginLeftVal;
    			},
    			scrollboxSize: function() {
    				computeStyleTests();
    				return scrollboxSizeVal;
    			},

    			// Support: IE 9 - 11+, Edge 15 - 18+
    			// IE/Edge misreport `getComputedStyle` of table rows with width/height
    			// set in CSS while `offset*` properties report correct values.
    			// Behavior in IE 9 is more subtle than in newer versions & it passes
    			// some versions of this test; make sure not to make it pass there!
    			//
    			// Support: Firefox 70+
    			// Only Firefox includes border widths
    			// in computed dimensions. (gh-4529)
    			reliableTrDimensions: function() {
    				var table, tr, trChild, trStyle;
    				if ( reliableTrDimensionsVal == null ) {
    					table = document.createElement( "table" );
    					tr = document.createElement( "tr" );
    					trChild = document.createElement( "div" );

    					table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
    					tr.style.cssText = "border:1px solid";

    					// Support: Chrome 86+
    					// Height set through cssText does not get applied.
    					// Computed height then comes back as 0.
    					tr.style.height = "1px";
    					trChild.style.height = "9px";

    					// Support: Android 8 Chrome 86+
    					// In our bodyBackground.html iframe,
    					// display for all div elements is set to "inline",
    					// which causes a problem only in Android 8 Chrome 86.
    					// Ensuring the div is display: block
    					// gets around this issue.
    					trChild.style.display = "block";

    					documentElement
    						.appendChild( table )
    						.appendChild( tr )
    						.appendChild( trChild );

    					trStyle = window.getComputedStyle( tr );
    					reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
    						parseInt( trStyle.borderTopWidth, 10 ) +
    						parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

    					documentElement.removeChild( table );
    				}
    				return reliableTrDimensionsVal;
    			}
    		} );
    	} )();


    	function curCSS( elem, name, computed ) {
    		var width, minWidth, maxWidth, ret,
    			isCustomProp = rcustomProp.test( name ),

    			// Support: Firefox 51+
    			// Retrieving style before computed somehow
    			// fixes an issue with getting wrong values
    			// on detached elements
    			style = elem.style;

    		computed = computed || getStyles( elem );

    		// getPropertyValue is needed for:
    		//   .css('filter') (IE 9 only, trac-12537)
    		//   .css('--customProperty) (gh-3144)
    		if ( computed ) {

    			// Support: IE <=9 - 11+
    			// IE only supports `"float"` in `getPropertyValue`; in computed styles
    			// it's only available as `"cssFloat"`. We no longer modify properties
    			// sent to `.css()` apart from camelCasing, so we need to check both.
    			// Normally, this would create difference in behavior: if
    			// `getPropertyValue` returns an empty string, the value returned
    			// by `.css()` would be `undefined`. This is usually the case for
    			// disconnected elements. However, in IE even disconnected elements
    			// with no styles return `"none"` for `getPropertyValue( "float" )`
    			ret = computed.getPropertyValue( name ) || computed[ name ];

    			if ( isCustomProp && ret ) {

    				// Support: Firefox 105+, Chrome <=105+
    				// Spec requires trimming whitespace for custom properties (gh-4926).
    				// Firefox only trims leading whitespace. Chrome just collapses
    				// both leading & trailing whitespace to a single space.
    				//
    				// Fall back to `undefined` if empty string returned.
    				// This collapses a missing definition with property defined
    				// and set to an empty string but there's no standard API
    				// allowing us to differentiate them without a performance penalty
    				// and returning `undefined` aligns with older jQuery.
    				//
    				// rtrimCSS treats U+000D CARRIAGE RETURN and U+000C FORM FEED
    				// as whitespace while CSS does not, but this is not a problem
    				// because CSS preprocessing replaces them with U+000A LINE FEED
    				// (which *is* CSS whitespace)
    				// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
    				ret = ret.replace( rtrimCSS, "$1" ) || undefined;
    			}

    			if ( ret === "" && !isAttached( elem ) ) {
    				ret = jQuery.style( elem, name );
    			}

    			// A tribute to the "awesome hack by Dean Edwards"
    			// Android Browser returns percentage for some values,
    			// but width seems to be reliably pixels.
    			// This is against the CSSOM draft spec:
    			// https://drafts.csswg.org/cssom/#resolved-values
    			if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

    				// Remember the original values
    				width = style.width;
    				minWidth = style.minWidth;
    				maxWidth = style.maxWidth;

    				// Put in the new values to get a computed value out
    				style.minWidth = style.maxWidth = style.width = ret;
    				ret = computed.width;

    				// Revert the changed values
    				style.width = width;
    				style.minWidth = minWidth;
    				style.maxWidth = maxWidth;
    			}
    		}

    		return ret !== undefined ?

    			// Support: IE <=9 - 11 only
    			// IE returns zIndex value as an integer.
    			ret + "" :
    			ret;
    	}


    	function addGetHookIf( conditionFn, hookFn ) {

    		// Define the hook, we'll check on the first run if it's really needed.
    		return {
    			get: function() {
    				if ( conditionFn() ) {

    					// Hook not needed (or it's not possible to use it due
    					// to missing dependency), remove it.
    					delete this.get;
    					return;
    				}

    				// Hook needed; redefine it so that the support test is not executed again.
    				return ( this.get = hookFn ).apply( this, arguments );
    			}
    		};
    	}


    	var cssPrefixes = [ "Webkit", "Moz", "ms" ],
    		emptyStyle = document.createElement( "div" ).style,
    		vendorProps = {};

    	// Return a vendor-prefixed property or undefined
    	function vendorPropName( name ) {

    		// Check for vendor prefixed names
    		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
    			i = cssPrefixes.length;

    		while ( i-- ) {
    			name = cssPrefixes[ i ] + capName;
    			if ( name in emptyStyle ) {
    				return name;
    			}
    		}
    	}

    	// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
    	function finalPropName( name ) {
    		var final = jQuery.cssProps[ name ] || vendorProps[ name ];

    		if ( final ) {
    			return final;
    		}
    		if ( name in emptyStyle ) {
    			return name;
    		}
    		return vendorProps[ name ] = vendorPropName( name ) || name;
    	}


    	var

    		// Swappable if display is none or starts with table
    		// except "table", "table-cell", or "table-caption"
    		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
    		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    		cssNormalTransform = {
    			letterSpacing: "0",
    			fontWeight: "400"
    		};

    	function setPositiveNumber( _elem, value, subtract ) {

    		// Any relative (+/-) values have already been
    		// normalized at this point
    		var matches = rcssNum.exec( value );
    		return matches ?

    			// Guard against undefined "subtract", e.g., when used as in cssHooks
    			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
    			value;
    	}

    	function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
    		var i = dimension === "width" ? 1 : 0,
    			extra = 0,
    			delta = 0;

    		// Adjustment may not be necessary
    		if ( box === ( isBorderBox ? "border" : "content" ) ) {
    			return 0;
    		}

    		for ( ; i < 4; i += 2 ) {

    			// Both box models exclude margin
    			if ( box === "margin" ) {
    				delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
    			}

    			// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
    			if ( !isBorderBox ) {

    				// Add padding
    				delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

    				// For "border" or "margin", add border
    				if ( box !== "padding" ) {
    					delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

    				// But still keep track of it otherwise
    				} else {
    					extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
    				}

    			// If we get here with a border-box (content + padding + border), we're seeking "content" or
    			// "padding" or "margin"
    			} else {

    				// For "content", subtract padding
    				if ( box === "content" ) {
    					delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
    				}

    				// For "content" or "padding", subtract border
    				if ( box !== "margin" ) {
    					delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
    				}
    			}
    		}

    		// Account for positive content-box scroll gutter when requested by providing computedVal
    		if ( !isBorderBox && computedVal >= 0 ) {

    			// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
    			// Assuming integer scroll gutter, subtract the rest and round down
    			delta += Math.max( 0, Math.ceil(
    				elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
    				computedVal -
    				delta -
    				extra -
    				0.5

    			// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
    			// Use an explicit zero to avoid NaN (gh-3964)
    			) ) || 0;
    		}

    		return delta;
    	}

    	function getWidthOrHeight( elem, dimension, extra ) {

    		// Start with computed style
    		var styles = getStyles( elem ),

    			// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
    			// Fake content-box until we know it's needed to know the true value.
    			boxSizingNeeded = !support.boxSizingReliable() || extra,
    			isBorderBox = boxSizingNeeded &&
    				jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
    			valueIsBorderBox = isBorderBox,

    			val = curCSS( elem, dimension, styles ),
    			offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

    		// Support: Firefox <=54
    		// Return a confounding non-pixel value or feign ignorance, as appropriate.
    		if ( rnumnonpx.test( val ) ) {
    			if ( !extra ) {
    				return val;
    			}
    			val = "auto";
    		}


    		// Support: IE 9 - 11 only
    		// Use offsetWidth/offsetHeight for when box sizing is unreliable.
    		// In those cases, the computed value can be trusted to be border-box.
    		if ( ( !support.boxSizingReliable() && isBorderBox ||

    			// Support: IE 10 - 11+, Edge 15 - 18+
    			// IE/Edge misreport `getComputedStyle` of table rows with width/height
    			// set in CSS while `offset*` properties report correct values.
    			// Interestingly, in some cases IE 9 doesn't suffer from this issue.
    			!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

    			// Fall back to offsetWidth/offsetHeight when value is "auto"
    			// This happens for inline elements with no explicit setting (gh-3571)
    			val === "auto" ||

    			// Support: Android <=4.1 - 4.3 only
    			// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
    			!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

    			// Make sure the element is visible & connected
    			elem.getClientRects().length ) {

    			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

    			// Where available, offsetWidth/offsetHeight approximate border box dimensions.
    			// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
    			// retrieved value as a content box dimension.
    			valueIsBorderBox = offsetProp in elem;
    			if ( valueIsBorderBox ) {
    				val = elem[ offsetProp ];
    			}
    		}

    		// Normalize "" and auto
    		val = parseFloat( val ) || 0;

    		// Adjust for the element's box model
    		return ( val +
    			boxModelAdjustment(
    				elem,
    				dimension,
    				extra || ( isBorderBox ? "border" : "content" ),
    				valueIsBorderBox,
    				styles,

    				// Provide the current computed size to request scroll gutter calculation (gh-3589)
    				val
    			)
    		) + "px";
    	}

    	jQuery.extend( {

    		// Add in style property hooks for overriding the default
    		// behavior of getting and setting a style property
    		cssHooks: {
    			opacity: {
    				get: function( elem, computed ) {
    					if ( computed ) {

    						// We should always get a number back from opacity
    						var ret = curCSS( elem, "opacity" );
    						return ret === "" ? "1" : ret;
    					}
    				}
    			}
    		},

    		// Don't automatically add "px" to these possibly-unitless properties
    		cssNumber: {
    			"animationIterationCount": true,
    			"columnCount": true,
    			"fillOpacity": true,
    			"flexGrow": true,
    			"flexShrink": true,
    			"fontWeight": true,
    			"gridArea": true,
    			"gridColumn": true,
    			"gridColumnEnd": true,
    			"gridColumnStart": true,
    			"gridRow": true,
    			"gridRowEnd": true,
    			"gridRowStart": true,
    			"lineHeight": true,
    			"opacity": true,
    			"order": true,
    			"orphans": true,
    			"widows": true,
    			"zIndex": true,
    			"zoom": true
    		},

    		// Add in properties whose names you wish to fix before
    		// setting or getting the value
    		cssProps: {},

    		// Get and set the style property on a DOM Node
    		style: function( elem, name, value, extra ) {

    			// Don't set styles on text and comment nodes
    			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
    				return;
    			}

    			// Make sure that we're working with the right name
    			var ret, type, hooks,
    				origName = camelCase( name ),
    				isCustomProp = rcustomProp.test( name ),
    				style = elem.style;

    			// Make sure that we're working with the right name. We don't
    			// want to query the value if it is a CSS custom property
    			// since they are user-defined.
    			if ( !isCustomProp ) {
    				name = finalPropName( origName );
    			}

    			// Gets hook for the prefixed version, then unprefixed version
    			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    			// Check if we're setting a value
    			if ( value !== undefined ) {
    				type = typeof value;

    				// Convert "+=" or "-=" to relative numbers (trac-7345)
    				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
    					value = adjustCSS( elem, name, ret );

    					// Fixes bug trac-9237
    					type = "number";
    				}

    				// Make sure that null and NaN values aren't set (trac-7116)
    				if ( value == null || value !== value ) {
    					return;
    				}

    				// If a number was passed in, add the unit (except for certain CSS properties)
    				// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
    				// "px" to a few hardcoded values.
    				if ( type === "number" && !isCustomProp ) {
    					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
    				}

    				// background-* props affect original clone's values
    				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
    					style[ name ] = "inherit";
    				}

    				// If a hook was provided, use that value, otherwise just set the specified value
    				if ( !hooks || !( "set" in hooks ) ||
    					( value = hooks.set( elem, value, extra ) ) !== undefined ) {

    					if ( isCustomProp ) {
    						style.setProperty( name, value );
    					} else {
    						style[ name ] = value;
    					}
    				}

    			} else {

    				// If a hook was provided get the non-computed value from there
    				if ( hooks && "get" in hooks &&
    					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

    					return ret;
    				}

    				// Otherwise just get the value from the style object
    				return style[ name ];
    			}
    		},

    		css: function( elem, name, extra, styles ) {
    			var val, num, hooks,
    				origName = camelCase( name ),
    				isCustomProp = rcustomProp.test( name );

    			// Make sure that we're working with the right name. We don't
    			// want to modify the value if it is a CSS custom property
    			// since they are user-defined.
    			if ( !isCustomProp ) {
    				name = finalPropName( origName );
    			}

    			// Try prefixed name followed by the unprefixed name
    			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    			// If a hook was provided get the computed value from there
    			if ( hooks && "get" in hooks ) {
    				val = hooks.get( elem, true, extra );
    			}

    			// Otherwise, if a way to get the computed value exists, use that
    			if ( val === undefined ) {
    				val = curCSS( elem, name, styles );
    			}

    			// Convert "normal" to computed value
    			if ( val === "normal" && name in cssNormalTransform ) {
    				val = cssNormalTransform[ name ];
    			}

    			// Make numeric if forced or a qualifier was provided and val looks numeric
    			if ( extra === "" || extra ) {
    				num = parseFloat( val );
    				return extra === true || isFinite( num ) ? num || 0 : val;
    			}

    			return val;
    		}
    	} );

    	jQuery.each( [ "height", "width" ], function( _i, dimension ) {
    		jQuery.cssHooks[ dimension ] = {
    			get: function( elem, computed, extra ) {
    				if ( computed ) {

    					// Certain elements can have dimension info if we invisibly show them
    					// but it must have a current display style that would benefit
    					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

    						// Support: Safari 8+
    						// Table columns in Safari have non-zero offsetWidth & zero
    						// getBoundingClientRect().width unless display is changed.
    						// Support: IE <=11 only
    						// Running getBoundingClientRect on a disconnected node
    						// in IE throws an error.
    						( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
    						swap( elem, cssShow, function() {
    							return getWidthOrHeight( elem, dimension, extra );
    						} ) :
    						getWidthOrHeight( elem, dimension, extra );
    				}
    			},

    			set: function( elem, value, extra ) {
    				var matches,
    					styles = getStyles( elem ),

    					// Only read styles.position if the test has a chance to fail
    					// to avoid forcing a reflow.
    					scrollboxSizeBuggy = !support.scrollboxSize() &&
    						styles.position === "absolute",

    					// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
    					boxSizingNeeded = scrollboxSizeBuggy || extra,
    					isBorderBox = boxSizingNeeded &&
    						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
    					subtract = extra ?
    						boxModelAdjustment(
    							elem,
    							dimension,
    							extra,
    							isBorderBox,
    							styles
    						) :
    						0;

    				// Account for unreliable border-box dimensions by comparing offset* to computed and
    				// faking a content-box to get border and padding (gh-3699)
    				if ( isBorderBox && scrollboxSizeBuggy ) {
    					subtract -= Math.ceil(
    						elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
    						parseFloat( styles[ dimension ] ) -
    						boxModelAdjustment( elem, dimension, "border", false, styles ) -
    						0.5
    					);
    				}

    				// Convert to pixels if value adjustment is needed
    				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
    					( matches[ 3 ] || "px" ) !== "px" ) {

    					elem.style[ dimension ] = value;
    					value = jQuery.css( elem, dimension );
    				}

    				return setPositiveNumber( elem, value, subtract );
    			}
    		};
    	} );

    	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
    		function( elem, computed ) {
    			if ( computed ) {
    				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
    					elem.getBoundingClientRect().left -
    						swap( elem, { marginLeft: 0 }, function() {
    							return elem.getBoundingClientRect().left;
    						} )
    				) + "px";
    			}
    		}
    	);

    	// These hooks are used by animate to expand properties
    	jQuery.each( {
    		margin: "",
    		padding: "",
    		border: "Width"
    	}, function( prefix, suffix ) {
    		jQuery.cssHooks[ prefix + suffix ] = {
    			expand: function( value ) {
    				var i = 0,
    					expanded = {},

    					// Assumes a single number if not a string
    					parts = typeof value === "string" ? value.split( " " ) : [ value ];

    				for ( ; i < 4; i++ ) {
    					expanded[ prefix + cssExpand[ i ] + suffix ] =
    						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
    				}

    				return expanded;
    			}
    		};

    		if ( prefix !== "margin" ) {
    			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
    		}
    	} );

    	jQuery.fn.extend( {
    		css: function( name, value ) {
    			return access( this, function( elem, name, value ) {
    				var styles, len,
    					map = {},
    					i = 0;

    				if ( Array.isArray( name ) ) {
    					styles = getStyles( elem );
    					len = name.length;

    					for ( ; i < len; i++ ) {
    						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
    					}

    					return map;
    				}

    				return value !== undefined ?
    					jQuery.style( elem, name, value ) :
    					jQuery.css( elem, name );
    			}, name, value, arguments.length > 1 );
    		}
    	} );


    	function Tween( elem, options, prop, end, easing ) {
    		return new Tween.prototype.init( elem, options, prop, end, easing );
    	}
    	jQuery.Tween = Tween;

    	Tween.prototype = {
    		constructor: Tween,
    		init: function( elem, options, prop, end, easing, unit ) {
    			this.elem = elem;
    			this.prop = prop;
    			this.easing = easing || jQuery.easing._default;
    			this.options = options;
    			this.start = this.now = this.cur();
    			this.end = end;
    			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
    		},
    		cur: function() {
    			var hooks = Tween.propHooks[ this.prop ];

    			return hooks && hooks.get ?
    				hooks.get( this ) :
    				Tween.propHooks._default.get( this );
    		},
    		run: function( percent ) {
    			var eased,
    				hooks = Tween.propHooks[ this.prop ];

    			if ( this.options.duration ) {
    				this.pos = eased = jQuery.easing[ this.easing ](
    					percent, this.options.duration * percent, 0, 1, this.options.duration
    				);
    			} else {
    				this.pos = eased = percent;
    			}
    			this.now = ( this.end - this.start ) * eased + this.start;

    			if ( this.options.step ) {
    				this.options.step.call( this.elem, this.now, this );
    			}

    			if ( hooks && hooks.set ) {
    				hooks.set( this );
    			} else {
    				Tween.propHooks._default.set( this );
    			}
    			return this;
    		}
    	};

    	Tween.prototype.init.prototype = Tween.prototype;

    	Tween.propHooks = {
    		_default: {
    			get: function( tween ) {
    				var result;

    				// Use a property on the element directly when it is not a DOM element,
    				// or when there is no matching style property that exists.
    				if ( tween.elem.nodeType !== 1 ||
    					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
    					return tween.elem[ tween.prop ];
    				}

    				// Passing an empty string as a 3rd parameter to .css will automatically
    				// attempt a parseFloat and fallback to a string if the parse fails.
    				// Simple values such as "10px" are parsed to Float;
    				// complex values such as "rotate(1rad)" are returned as-is.
    				result = jQuery.css( tween.elem, tween.prop, "" );

    				// Empty strings, null, undefined and "auto" are converted to 0.
    				return !result || result === "auto" ? 0 : result;
    			},
    			set: function( tween ) {

    				// Use step hook for back compat.
    				// Use cssHook if its there.
    				// Use .style if available and use plain properties where available.
    				if ( jQuery.fx.step[ tween.prop ] ) {
    					jQuery.fx.step[ tween.prop ]( tween );
    				} else if ( tween.elem.nodeType === 1 && (
    					jQuery.cssHooks[ tween.prop ] ||
    						tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
    					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
    				} else {
    					tween.elem[ tween.prop ] = tween.now;
    				}
    			}
    		}
    	};

    	// Support: IE <=9 only
    	// Panic based approach to setting things on disconnected nodes
    	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    		set: function( tween ) {
    			if ( tween.elem.nodeType && tween.elem.parentNode ) {
    				tween.elem[ tween.prop ] = tween.now;
    			}
    		}
    	};

    	jQuery.easing = {
    		linear: function( p ) {
    			return p;
    		},
    		swing: function( p ) {
    			return 0.5 - Math.cos( p * Math.PI ) / 2;
    		},
    		_default: "swing"
    	};

    	jQuery.fx = Tween.prototype.init;

    	// Back compat <1.8 extension point
    	jQuery.fx.step = {};




    	var
    		fxNow, inProgress,
    		rfxtypes = /^(?:toggle|show|hide)$/,
    		rrun = /queueHooks$/;

    	function schedule() {
    		if ( inProgress ) {
    			if ( document.hidden === false && window.requestAnimationFrame ) {
    				window.requestAnimationFrame( schedule );
    			} else {
    				window.setTimeout( schedule, jQuery.fx.interval );
    			}

    			jQuery.fx.tick();
    		}
    	}

    	// Animations created synchronously will run synchronously
    	function createFxNow() {
    		window.setTimeout( function() {
    			fxNow = undefined;
    		} );
    		return ( fxNow = Date.now() );
    	}

    	// Generate parameters to create a standard animation
    	function genFx( type, includeWidth ) {
    		var which,
    			i = 0,
    			attrs = { height: type };

    		// If we include width, step value is 1 to do all cssExpand values,
    		// otherwise step value is 2 to skip over Left and Right
    		includeWidth = includeWidth ? 1 : 0;
    		for ( ; i < 4; i += 2 - includeWidth ) {
    			which = cssExpand[ i ];
    			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
    		}

    		if ( includeWidth ) {
    			attrs.opacity = attrs.width = type;
    		}

    		return attrs;
    	}

    	function createTween( value, prop, animation ) {
    		var tween,
    			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
    			index = 0,
    			length = collection.length;
    		for ( ; index < length; index++ ) {
    			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

    				// We're done with this property
    				return tween;
    			}
    		}
    	}

    	function defaultPrefilter( elem, props, opts ) {
    		var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
    			isBox = "width" in props || "height" in props,
    			anim = this,
    			orig = {},
    			style = elem.style,
    			hidden = elem.nodeType && isHiddenWithinTree( elem ),
    			dataShow = dataPriv.get( elem, "fxshow" );

    		// Queue-skipping animations hijack the fx hooks
    		if ( !opts.queue ) {
    			hooks = jQuery._queueHooks( elem, "fx" );
    			if ( hooks.unqueued == null ) {
    				hooks.unqueued = 0;
    				oldfire = hooks.empty.fire;
    				hooks.empty.fire = function() {
    					if ( !hooks.unqueued ) {
    						oldfire();
    					}
    				};
    			}
    			hooks.unqueued++;

    			anim.always( function() {

    				// Ensure the complete handler is called before this completes
    				anim.always( function() {
    					hooks.unqueued--;
    					if ( !jQuery.queue( elem, "fx" ).length ) {
    						hooks.empty.fire();
    					}
    				} );
    			} );
    		}

    		// Detect show/hide animations
    		for ( prop in props ) {
    			value = props[ prop ];
    			if ( rfxtypes.test( value ) ) {
    				delete props[ prop ];
    				toggle = toggle || value === "toggle";
    				if ( value === ( hidden ? "hide" : "show" ) ) {

    					// Pretend to be hidden if this is a "show" and
    					// there is still data from a stopped show/hide
    					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
    						hidden = true;

    					// Ignore all other no-op show/hide data
    					} else {
    						continue;
    					}
    				}
    				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
    			}
    		}

    		// Bail out if this is a no-op like .hide().hide()
    		propTween = !jQuery.isEmptyObject( props );
    		if ( !propTween && jQuery.isEmptyObject( orig ) ) {
    			return;
    		}

    		// Restrict "overflow" and "display" styles during box animations
    		if ( isBox && elem.nodeType === 1 ) {

    			// Support: IE <=9 - 11, Edge 12 - 15
    			// Record all 3 overflow attributes because IE does not infer the shorthand
    			// from identically-valued overflowX and overflowY and Edge just mirrors
    			// the overflowX value there.
    			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

    			// Identify a display type, preferring old show/hide data over the CSS cascade
    			restoreDisplay = dataShow && dataShow.display;
    			if ( restoreDisplay == null ) {
    				restoreDisplay = dataPriv.get( elem, "display" );
    			}
    			display = jQuery.css( elem, "display" );
    			if ( display === "none" ) {
    				if ( restoreDisplay ) {
    					display = restoreDisplay;
    				} else {

    					// Get nonempty value(s) by temporarily forcing visibility
    					showHide( [ elem ], true );
    					restoreDisplay = elem.style.display || restoreDisplay;
    					display = jQuery.css( elem, "display" );
    					showHide( [ elem ] );
    				}
    			}

    			// Animate inline elements as inline-block
    			if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
    				if ( jQuery.css( elem, "float" ) === "none" ) {

    					// Restore the original display value at the end of pure show/hide animations
    					if ( !propTween ) {
    						anim.done( function() {
    							style.display = restoreDisplay;
    						} );
    						if ( restoreDisplay == null ) {
    							display = style.display;
    							restoreDisplay = display === "none" ? "" : display;
    						}
    					}
    					style.display = "inline-block";
    				}
    			}
    		}

    		if ( opts.overflow ) {
    			style.overflow = "hidden";
    			anim.always( function() {
    				style.overflow = opts.overflow[ 0 ];
    				style.overflowX = opts.overflow[ 1 ];
    				style.overflowY = opts.overflow[ 2 ];
    			} );
    		}

    		// Implement show/hide animations
    		propTween = false;
    		for ( prop in orig ) {

    			// General show/hide setup for this element animation
    			if ( !propTween ) {
    				if ( dataShow ) {
    					if ( "hidden" in dataShow ) {
    						hidden = dataShow.hidden;
    					}
    				} else {
    					dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
    				}

    				// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
    				if ( toggle ) {
    					dataShow.hidden = !hidden;
    				}

    				// Show elements before animating them
    				if ( hidden ) {
    					showHide( [ elem ], true );
    				}

    				/* eslint-disable no-loop-func */

    				anim.done( function() {

    					/* eslint-enable no-loop-func */

    					// The final step of a "hide" animation is actually hiding the element
    					if ( !hidden ) {
    						showHide( [ elem ] );
    					}
    					dataPriv.remove( elem, "fxshow" );
    					for ( prop in orig ) {
    						jQuery.style( elem, prop, orig[ prop ] );
    					}
    				} );
    			}

    			// Per-property setup
    			propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
    			if ( !( prop in dataShow ) ) {
    				dataShow[ prop ] = propTween.start;
    				if ( hidden ) {
    					propTween.end = propTween.start;
    					propTween.start = 0;
    				}
    			}
    		}
    	}

    	function propFilter( props, specialEasing ) {
    		var index, name, easing, value, hooks;

    		// camelCase, specialEasing and expand cssHook pass
    		for ( index in props ) {
    			name = camelCase( index );
    			easing = specialEasing[ name ];
    			value = props[ index ];
    			if ( Array.isArray( value ) ) {
    				easing = value[ 1 ];
    				value = props[ index ] = value[ 0 ];
    			}

    			if ( index !== name ) {
    				props[ name ] = value;
    				delete props[ index ];
    			}

    			hooks = jQuery.cssHooks[ name ];
    			if ( hooks && "expand" in hooks ) {
    				value = hooks.expand( value );
    				delete props[ name ];

    				// Not quite $.extend, this won't overwrite existing keys.
    				// Reusing 'index' because we have the correct "name"
    				for ( index in value ) {
    					if ( !( index in props ) ) {
    						props[ index ] = value[ index ];
    						specialEasing[ index ] = easing;
    					}
    				}
    			} else {
    				specialEasing[ name ] = easing;
    			}
    		}
    	}

    	function Animation( elem, properties, options ) {
    		var result,
    			stopped,
    			index = 0,
    			length = Animation.prefilters.length,
    			deferred = jQuery.Deferred().always( function() {

    				// Don't match elem in the :animated selector
    				delete tick.elem;
    			} ),
    			tick = function() {
    				if ( stopped ) {
    					return false;
    				}
    				var currentTime = fxNow || createFxNow(),
    					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

    					// Support: Android 2.3 only
    					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (trac-12497)
    					temp = remaining / animation.duration || 0,
    					percent = 1 - temp,
    					index = 0,
    					length = animation.tweens.length;

    				for ( ; index < length; index++ ) {
    					animation.tweens[ index ].run( percent );
    				}

    				deferred.notifyWith( elem, [ animation, percent, remaining ] );

    				// If there's more to do, yield
    				if ( percent < 1 && length ) {
    					return remaining;
    				}

    				// If this was an empty animation, synthesize a final progress notification
    				if ( !length ) {
    					deferred.notifyWith( elem, [ animation, 1, 0 ] );
    				}

    				// Resolve the animation and report its conclusion
    				deferred.resolveWith( elem, [ animation ] );
    				return false;
    			},
    			animation = deferred.promise( {
    				elem: elem,
    				props: jQuery.extend( {}, properties ),
    				opts: jQuery.extend( true, {
    					specialEasing: {},
    					easing: jQuery.easing._default
    				}, options ),
    				originalProperties: properties,
    				originalOptions: options,
    				startTime: fxNow || createFxNow(),
    				duration: options.duration,
    				tweens: [],
    				createTween: function( prop, end ) {
    					var tween = jQuery.Tween( elem, animation.opts, prop, end,
    						animation.opts.specialEasing[ prop ] || animation.opts.easing );
    					animation.tweens.push( tween );
    					return tween;
    				},
    				stop: function( gotoEnd ) {
    					var index = 0,

    						// If we are going to the end, we want to run all the tweens
    						// otherwise we skip this part
    						length = gotoEnd ? animation.tweens.length : 0;
    					if ( stopped ) {
    						return this;
    					}
    					stopped = true;
    					for ( ; index < length; index++ ) {
    						animation.tweens[ index ].run( 1 );
    					}

    					// Resolve when we played the last frame; otherwise, reject
    					if ( gotoEnd ) {
    						deferred.notifyWith( elem, [ animation, 1, 0 ] );
    						deferred.resolveWith( elem, [ animation, gotoEnd ] );
    					} else {
    						deferred.rejectWith( elem, [ animation, gotoEnd ] );
    					}
    					return this;
    				}
    			} ),
    			props = animation.props;

    		propFilter( props, animation.opts.specialEasing );

    		for ( ; index < length; index++ ) {
    			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
    			if ( result ) {
    				if ( isFunction( result.stop ) ) {
    					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
    						result.stop.bind( result );
    				}
    				return result;
    			}
    		}

    		jQuery.map( props, createTween, animation );

    		if ( isFunction( animation.opts.start ) ) {
    			animation.opts.start.call( elem, animation );
    		}

    		// Attach callbacks from options
    		animation
    			.progress( animation.opts.progress )
    			.done( animation.opts.done, animation.opts.complete )
    			.fail( animation.opts.fail )
    			.always( animation.opts.always );

    		jQuery.fx.timer(
    			jQuery.extend( tick, {
    				elem: elem,
    				anim: animation,
    				queue: animation.opts.queue
    			} )
    		);

    		return animation;
    	}

    	jQuery.Animation = jQuery.extend( Animation, {

    		tweeners: {
    			"*": [ function( prop, value ) {
    				var tween = this.createTween( prop, value );
    				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
    				return tween;
    			} ]
    		},

    		tweener: function( props, callback ) {
    			if ( isFunction( props ) ) {
    				callback = props;
    				props = [ "*" ];
    			} else {
    				props = props.match( rnothtmlwhite );
    			}

    			var prop,
    				index = 0,
    				length = props.length;

    			for ( ; index < length; index++ ) {
    				prop = props[ index ];
    				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
    				Animation.tweeners[ prop ].unshift( callback );
    			}
    		},

    		prefilters: [ defaultPrefilter ],

    		prefilter: function( callback, prepend ) {
    			if ( prepend ) {
    				Animation.prefilters.unshift( callback );
    			} else {
    				Animation.prefilters.push( callback );
    			}
    		}
    	} );

    	jQuery.speed = function( speed, easing, fn ) {
    		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
    			complete: fn || !fn && easing ||
    				isFunction( speed ) && speed,
    			duration: speed,
    			easing: fn && easing || easing && !isFunction( easing ) && easing
    		};

    		// Go to the end state if fx are off
    		if ( jQuery.fx.off ) {
    			opt.duration = 0;

    		} else {
    			if ( typeof opt.duration !== "number" ) {
    				if ( opt.duration in jQuery.fx.speeds ) {
    					opt.duration = jQuery.fx.speeds[ opt.duration ];

    				} else {
    					opt.duration = jQuery.fx.speeds._default;
    				}
    			}
    		}

    		// Normalize opt.queue - true/undefined/null -> "fx"
    		if ( opt.queue == null || opt.queue === true ) {
    			opt.queue = "fx";
    		}

    		// Queueing
    		opt.old = opt.complete;

    		opt.complete = function() {
    			if ( isFunction( opt.old ) ) {
    				opt.old.call( this );
    			}

    			if ( opt.queue ) {
    				jQuery.dequeue( this, opt.queue );
    			}
    		};

    		return opt;
    	};

    	jQuery.fn.extend( {
    		fadeTo: function( speed, to, easing, callback ) {

    			// Show any hidden elements after setting opacity to 0
    			return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

    				// Animate to the value specified
    				.end().animate( { opacity: to }, speed, easing, callback );
    		},
    		animate: function( prop, speed, easing, callback ) {
    			var empty = jQuery.isEmptyObject( prop ),
    				optall = jQuery.speed( speed, easing, callback ),
    				doAnimation = function() {

    					// Operate on a copy of prop so per-property easing won't be lost
    					var anim = Animation( this, jQuery.extend( {}, prop ), optall );

    					// Empty animations, or finishing resolves immediately
    					if ( empty || dataPriv.get( this, "finish" ) ) {
    						anim.stop( true );
    					}
    				};

    			doAnimation.finish = doAnimation;

    			return empty || optall.queue === false ?
    				this.each( doAnimation ) :
    				this.queue( optall.queue, doAnimation );
    		},
    		stop: function( type, clearQueue, gotoEnd ) {
    			var stopQueue = function( hooks ) {
    				var stop = hooks.stop;
    				delete hooks.stop;
    				stop( gotoEnd );
    			};

    			if ( typeof type !== "string" ) {
    				gotoEnd = clearQueue;
    				clearQueue = type;
    				type = undefined;
    			}
    			if ( clearQueue ) {
    				this.queue( type || "fx", [] );
    			}

    			return this.each( function() {
    				var dequeue = true,
    					index = type != null && type + "queueHooks",
    					timers = jQuery.timers,
    					data = dataPriv.get( this );

    				if ( index ) {
    					if ( data[ index ] && data[ index ].stop ) {
    						stopQueue( data[ index ] );
    					}
    				} else {
    					for ( index in data ) {
    						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
    							stopQueue( data[ index ] );
    						}
    					}
    				}

    				for ( index = timers.length; index--; ) {
    					if ( timers[ index ].elem === this &&
    						( type == null || timers[ index ].queue === type ) ) {

    						timers[ index ].anim.stop( gotoEnd );
    						dequeue = false;
    						timers.splice( index, 1 );
    					}
    				}

    				// Start the next in the queue if the last step wasn't forced.
    				// Timers currently will call their complete callbacks, which
    				// will dequeue but only if they were gotoEnd.
    				if ( dequeue || !gotoEnd ) {
    					jQuery.dequeue( this, type );
    				}
    			} );
    		},
    		finish: function( type ) {
    			if ( type !== false ) {
    				type = type || "fx";
    			}
    			return this.each( function() {
    				var index,
    					data = dataPriv.get( this ),
    					queue = data[ type + "queue" ],
    					hooks = data[ type + "queueHooks" ],
    					timers = jQuery.timers,
    					length = queue ? queue.length : 0;

    				// Enable finishing flag on private data
    				data.finish = true;

    				// Empty the queue first
    				jQuery.queue( this, type, [] );

    				if ( hooks && hooks.stop ) {
    					hooks.stop.call( this, true );
    				}

    				// Look for any active animations, and finish them
    				for ( index = timers.length; index--; ) {
    					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
    						timers[ index ].anim.stop( true );
    						timers.splice( index, 1 );
    					}
    				}

    				// Look for any animations in the old queue and finish them
    				for ( index = 0; index < length; index++ ) {
    					if ( queue[ index ] && queue[ index ].finish ) {
    						queue[ index ].finish.call( this );
    					}
    				}

    				// Turn off finishing flag
    				delete data.finish;
    			} );
    		}
    	} );

    	jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
    		var cssFn = jQuery.fn[ name ];
    		jQuery.fn[ name ] = function( speed, easing, callback ) {
    			return speed == null || typeof speed === "boolean" ?
    				cssFn.apply( this, arguments ) :
    				this.animate( genFx( name, true ), speed, easing, callback );
    		};
    	} );

    	// Generate shortcuts for custom animations
    	jQuery.each( {
    		slideDown: genFx( "show" ),
    		slideUp: genFx( "hide" ),
    		slideToggle: genFx( "toggle" ),
    		fadeIn: { opacity: "show" },
    		fadeOut: { opacity: "hide" },
    		fadeToggle: { opacity: "toggle" }
    	}, function( name, props ) {
    		jQuery.fn[ name ] = function( speed, easing, callback ) {
    			return this.animate( props, speed, easing, callback );
    		};
    	} );

    	jQuery.timers = [];
    	jQuery.fx.tick = function() {
    		var timer,
    			i = 0,
    			timers = jQuery.timers;

    		fxNow = Date.now();

    		for ( ; i < timers.length; i++ ) {
    			timer = timers[ i ];

    			// Run the timer and safely remove it when done (allowing for external removal)
    			if ( !timer() && timers[ i ] === timer ) {
    				timers.splice( i--, 1 );
    			}
    		}

    		if ( !timers.length ) {
    			jQuery.fx.stop();
    		}
    		fxNow = undefined;
    	};

    	jQuery.fx.timer = function( timer ) {
    		jQuery.timers.push( timer );
    		jQuery.fx.start();
    	};

    	jQuery.fx.interval = 13;
    	jQuery.fx.start = function() {
    		if ( inProgress ) {
    			return;
    		}

    		inProgress = true;
    		schedule();
    	};

    	jQuery.fx.stop = function() {
    		inProgress = null;
    	};

    	jQuery.fx.speeds = {
    		slow: 600,
    		fast: 200,

    		// Default speed
    		_default: 400
    	};


    	// Based off of the plugin by Clint Helfers, with permission.
    	jQuery.fn.delay = function( time, type ) {
    		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
    		type = type || "fx";

    		return this.queue( type, function( next, hooks ) {
    			var timeout = window.setTimeout( next, time );
    			hooks.stop = function() {
    				window.clearTimeout( timeout );
    			};
    		} );
    	};


    	( function() {
    		var input = document.createElement( "input" ),
    			select = document.createElement( "select" ),
    			opt = select.appendChild( document.createElement( "option" ) );

    		input.type = "checkbox";

    		// Support: Android <=4.3 only
    		// Default value for a checkbox should be "on"
    		support.checkOn = input.value !== "";

    		// Support: IE <=11 only
    		// Must access selectedIndex to make default options select
    		support.optSelected = opt.selected;

    		// Support: IE <=11 only
    		// An input loses its value after becoming a radio
    		input = document.createElement( "input" );
    		input.value = "t";
    		input.type = "radio";
    		support.radioValue = input.value === "t";
    	} )();


    	var boolHook,
    		attrHandle = jQuery.expr.attrHandle;

    	jQuery.fn.extend( {
    		attr: function( name, value ) {
    			return access( this, jQuery.attr, name, value, arguments.length > 1 );
    		},

    		removeAttr: function( name ) {
    			return this.each( function() {
    				jQuery.removeAttr( this, name );
    			} );
    		}
    	} );

    	jQuery.extend( {
    		attr: function( elem, name, value ) {
    			var ret, hooks,
    				nType = elem.nodeType;

    			// Don't get/set attributes on text, comment and attribute nodes
    			if ( nType === 3 || nType === 8 || nType === 2 ) {
    				return;
    			}

    			// Fallback to prop when attributes are not supported
    			if ( typeof elem.getAttribute === "undefined" ) {
    				return jQuery.prop( elem, name, value );
    			}

    			// Attribute hooks are determined by the lowercase version
    			// Grab necessary hook if one is defined
    			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
    				hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
    					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
    			}

    			if ( value !== undefined ) {
    				if ( value === null ) {
    					jQuery.removeAttr( elem, name );
    					return;
    				}

    				if ( hooks && "set" in hooks &&
    					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
    					return ret;
    				}

    				elem.setAttribute( name, value + "" );
    				return value;
    			}

    			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
    				return ret;
    			}

    			ret = jQuery.find.attr( elem, name );

    			// Non-existent attributes return null, we normalize to undefined
    			return ret == null ? undefined : ret;
    		},

    		attrHooks: {
    			type: {
    				set: function( elem, value ) {
    					if ( !support.radioValue && value === "radio" &&
    						nodeName( elem, "input" ) ) {
    						var val = elem.value;
    						elem.setAttribute( "type", value );
    						if ( val ) {
    							elem.value = val;
    						}
    						return value;
    					}
    				}
    			}
    		},

    		removeAttr: function( elem, value ) {
    			var name,
    				i = 0,

    				// Attribute names can contain non-HTML whitespace characters
    				// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
    				attrNames = value && value.match( rnothtmlwhite );

    			if ( attrNames && elem.nodeType === 1 ) {
    				while ( ( name = attrNames[ i++ ] ) ) {
    					elem.removeAttribute( name );
    				}
    			}
    		}
    	} );

    	// Hooks for boolean attributes
    	boolHook = {
    		set: function( elem, value, name ) {
    			if ( value === false ) {

    				// Remove boolean attributes when set to false
    				jQuery.removeAttr( elem, name );
    			} else {
    				elem.setAttribute( name, name );
    			}
    			return name;
    		}
    	};

    	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
    		var getter = attrHandle[ name ] || jQuery.find.attr;

    		attrHandle[ name ] = function( elem, name, isXML ) {
    			var ret, handle,
    				lowercaseName = name.toLowerCase();

    			if ( !isXML ) {

    				// Avoid an infinite loop by temporarily removing this function from the getter
    				handle = attrHandle[ lowercaseName ];
    				attrHandle[ lowercaseName ] = ret;
    				ret = getter( elem, name, isXML ) != null ?
    					lowercaseName :
    					null;
    				attrHandle[ lowercaseName ] = handle;
    			}
    			return ret;
    		};
    	} );




    	var rfocusable = /^(?:input|select|textarea|button)$/i,
    		rclickable = /^(?:a|area)$/i;

    	jQuery.fn.extend( {
    		prop: function( name, value ) {
    			return access( this, jQuery.prop, name, value, arguments.length > 1 );
    		},

    		removeProp: function( name ) {
    			return this.each( function() {
    				delete this[ jQuery.propFix[ name ] || name ];
    			} );
    		}
    	} );

    	jQuery.extend( {
    		prop: function( elem, name, value ) {
    			var ret, hooks,
    				nType = elem.nodeType;

    			// Don't get/set properties on text, comment and attribute nodes
    			if ( nType === 3 || nType === 8 || nType === 2 ) {
    				return;
    			}

    			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

    				// Fix name and attach hooks
    				name = jQuery.propFix[ name ] || name;
    				hooks = jQuery.propHooks[ name ];
    			}

    			if ( value !== undefined ) {
    				if ( hooks && "set" in hooks &&
    					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
    					return ret;
    				}

    				return ( elem[ name ] = value );
    			}

    			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
    				return ret;
    			}

    			return elem[ name ];
    		},

    		propHooks: {
    			tabIndex: {
    				get: function( elem ) {

    					// Support: IE <=9 - 11 only
    					// elem.tabIndex doesn't always return the
    					// correct value when it hasn't been explicitly set
    					// Use proper attribute retrieval (trac-12072)
    					var tabindex = jQuery.find.attr( elem, "tabindex" );

    					if ( tabindex ) {
    						return parseInt( tabindex, 10 );
    					}

    					if (
    						rfocusable.test( elem.nodeName ) ||
    						rclickable.test( elem.nodeName ) &&
    						elem.href
    					) {
    						return 0;
    					}

    					return -1;
    				}
    			}
    		},

    		propFix: {
    			"for": "htmlFor",
    			"class": "className"
    		}
    	} );

    	// Support: IE <=11 only
    	// Accessing the selectedIndex property
    	// forces the browser to respect setting selected
    	// on the option
    	// The getter ensures a default option is selected
    	// when in an optgroup
    	// eslint rule "no-unused-expressions" is disabled for this code
    	// since it considers such accessions noop
    	if ( !support.optSelected ) {
    		jQuery.propHooks.selected = {
    			get: function( elem ) {

    				/* eslint no-unused-expressions: "off" */

    				var parent = elem.parentNode;
    				if ( parent && parent.parentNode ) {
    					parent.parentNode.selectedIndex;
    				}
    				return null;
    			},
    			set: function( elem ) {

    				/* eslint no-unused-expressions: "off" */

    				var parent = elem.parentNode;
    				if ( parent ) {
    					parent.selectedIndex;

    					if ( parent.parentNode ) {
    						parent.parentNode.selectedIndex;
    					}
    				}
    			}
    		};
    	}

    	jQuery.each( [
    		"tabIndex",
    		"readOnly",
    		"maxLength",
    		"cellSpacing",
    		"cellPadding",
    		"rowSpan",
    		"colSpan",
    		"useMap",
    		"frameBorder",
    		"contentEditable"
    	], function() {
    		jQuery.propFix[ this.toLowerCase() ] = this;
    	} );




    		// Strip and collapse whitespace according to HTML spec
    		// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
    		function stripAndCollapse( value ) {
    			var tokens = value.match( rnothtmlwhite ) || [];
    			return tokens.join( " " );
    		}


    	function getClass( elem ) {
    		return elem.getAttribute && elem.getAttribute( "class" ) || "";
    	}

    	function classesToArray( value ) {
    		if ( Array.isArray( value ) ) {
    			return value;
    		}
    		if ( typeof value === "string" ) {
    			return value.match( rnothtmlwhite ) || [];
    		}
    		return [];
    	}

    	jQuery.fn.extend( {
    		addClass: function( value ) {
    			var classNames, cur, curValue, className, i, finalValue;

    			if ( isFunction( value ) ) {
    				return this.each( function( j ) {
    					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
    				} );
    			}

    			classNames = classesToArray( value );

    			if ( classNames.length ) {
    				return this.each( function() {
    					curValue = getClass( this );
    					cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

    					if ( cur ) {
    						for ( i = 0; i < classNames.length; i++ ) {
    							className = classNames[ i ];
    							if ( cur.indexOf( " " + className + " " ) < 0 ) {
    								cur += className + " ";
    							}
    						}

    						// Only assign if different to avoid unneeded rendering.
    						finalValue = stripAndCollapse( cur );
    						if ( curValue !== finalValue ) {
    							this.setAttribute( "class", finalValue );
    						}
    					}
    				} );
    			}

    			return this;
    		},

    		removeClass: function( value ) {
    			var classNames, cur, curValue, className, i, finalValue;

    			if ( isFunction( value ) ) {
    				return this.each( function( j ) {
    					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
    				} );
    			}

    			if ( !arguments.length ) {
    				return this.attr( "class", "" );
    			}

    			classNames = classesToArray( value );

    			if ( classNames.length ) {
    				return this.each( function() {
    					curValue = getClass( this );

    					// This expression is here for better compressibility (see addClass)
    					cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

    					if ( cur ) {
    						for ( i = 0; i < classNames.length; i++ ) {
    							className = classNames[ i ];

    							// Remove *all* instances
    							while ( cur.indexOf( " " + className + " " ) > -1 ) {
    								cur = cur.replace( " " + className + " ", " " );
    							}
    						}

    						// Only assign if different to avoid unneeded rendering.
    						finalValue = stripAndCollapse( cur );
    						if ( curValue !== finalValue ) {
    							this.setAttribute( "class", finalValue );
    						}
    					}
    				} );
    			}

    			return this;
    		},

    		toggleClass: function( value, stateVal ) {
    			var classNames, className, i, self,
    				type = typeof value,
    				isValidValue = type === "string" || Array.isArray( value );

    			if ( isFunction( value ) ) {
    				return this.each( function( i ) {
    					jQuery( this ).toggleClass(
    						value.call( this, i, getClass( this ), stateVal ),
    						stateVal
    					);
    				} );
    			}

    			if ( typeof stateVal === "boolean" && isValidValue ) {
    				return stateVal ? this.addClass( value ) : this.removeClass( value );
    			}

    			classNames = classesToArray( value );

    			return this.each( function() {
    				if ( isValidValue ) {

    					// Toggle individual class names
    					self = jQuery( this );

    					for ( i = 0; i < classNames.length; i++ ) {
    						className = classNames[ i ];

    						// Check each className given, space separated list
    						if ( self.hasClass( className ) ) {
    							self.removeClass( className );
    						} else {
    							self.addClass( className );
    						}
    					}

    				// Toggle whole class name
    				} else if ( value === undefined || type === "boolean" ) {
    					className = getClass( this );
    					if ( className ) {

    						// Store className if set
    						dataPriv.set( this, "__className__", className );
    					}

    					// If the element has a class name or if we're passed `false`,
    					// then remove the whole classname (if there was one, the above saved it).
    					// Otherwise bring back whatever was previously saved (if anything),
    					// falling back to the empty string if nothing was stored.
    					if ( this.setAttribute ) {
    						this.setAttribute( "class",
    							className || value === false ?
    								"" :
    								dataPriv.get( this, "__className__" ) || ""
    						);
    					}
    				}
    			} );
    		},

    		hasClass: function( selector ) {
    			var className, elem,
    				i = 0;

    			className = " " + selector + " ";
    			while ( ( elem = this[ i++ ] ) ) {
    				if ( elem.nodeType === 1 &&
    					( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
    					return true;
    				}
    			}

    			return false;
    		}
    	} );




    	var rreturn = /\r/g;

    	jQuery.fn.extend( {
    		val: function( value ) {
    			var hooks, ret, valueIsFunction,
    				elem = this[ 0 ];

    			if ( !arguments.length ) {
    				if ( elem ) {
    					hooks = jQuery.valHooks[ elem.type ] ||
    						jQuery.valHooks[ elem.nodeName.toLowerCase() ];

    					if ( hooks &&
    						"get" in hooks &&
    						( ret = hooks.get( elem, "value" ) ) !== undefined
    					) {
    						return ret;
    					}

    					ret = elem.value;

    					// Handle most common string cases
    					if ( typeof ret === "string" ) {
    						return ret.replace( rreturn, "" );
    					}

    					// Handle cases where value is null/undef or number
    					return ret == null ? "" : ret;
    				}

    				return;
    			}

    			valueIsFunction = isFunction( value );

    			return this.each( function( i ) {
    				var val;

    				if ( this.nodeType !== 1 ) {
    					return;
    				}

    				if ( valueIsFunction ) {
    					val = value.call( this, i, jQuery( this ).val() );
    				} else {
    					val = value;
    				}

    				// Treat null/undefined as ""; convert numbers to string
    				if ( val == null ) {
    					val = "";

    				} else if ( typeof val === "number" ) {
    					val += "";

    				} else if ( Array.isArray( val ) ) {
    					val = jQuery.map( val, function( value ) {
    						return value == null ? "" : value + "";
    					} );
    				}

    				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

    				// If set returns undefined, fall back to normal setting
    				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
    					this.value = val;
    				}
    			} );
    		}
    	} );

    	jQuery.extend( {
    		valHooks: {
    			option: {
    				get: function( elem ) {

    					var val = jQuery.find.attr( elem, "value" );
    					return val != null ?
    						val :

    						// Support: IE <=10 - 11 only
    						// option.text throws exceptions (trac-14686, trac-14858)
    						// Strip and collapse whitespace
    						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
    						stripAndCollapse( jQuery.text( elem ) );
    				}
    			},
    			select: {
    				get: function( elem ) {
    					var value, option, i,
    						options = elem.options,
    						index = elem.selectedIndex,
    						one = elem.type === "select-one",
    						values = one ? null : [],
    						max = one ? index + 1 : options.length;

    					if ( index < 0 ) {
    						i = max;

    					} else {
    						i = one ? index : 0;
    					}

    					// Loop through all the selected options
    					for ( ; i < max; i++ ) {
    						option = options[ i ];

    						// Support: IE <=9 only
    						// IE8-9 doesn't update selected after form reset (trac-2551)
    						if ( ( option.selected || i === index ) &&

    								// Don't return options that are disabled or in a disabled optgroup
    								!option.disabled &&
    								( !option.parentNode.disabled ||
    									!nodeName( option.parentNode, "optgroup" ) ) ) {

    							// Get the specific value for the option
    							value = jQuery( option ).val();

    							// We don't need an array for one selects
    							if ( one ) {
    								return value;
    							}

    							// Multi-Selects return an array
    							values.push( value );
    						}
    					}

    					return values;
    				},

    				set: function( elem, value ) {
    					var optionSet, option,
    						options = elem.options,
    						values = jQuery.makeArray( value ),
    						i = options.length;

    					while ( i-- ) {
    						option = options[ i ];

    						/* eslint-disable no-cond-assign */

    						if ( option.selected =
    							jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
    						) {
    							optionSet = true;
    						}

    						/* eslint-enable no-cond-assign */
    					}

    					// Force browsers to behave consistently when non-matching value is set
    					if ( !optionSet ) {
    						elem.selectedIndex = -1;
    					}
    					return values;
    				}
    			}
    		}
    	} );

    	// Radios and checkboxes getter/setter
    	jQuery.each( [ "radio", "checkbox" ], function() {
    		jQuery.valHooks[ this ] = {
    			set: function( elem, value ) {
    				if ( Array.isArray( value ) ) {
    					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
    				}
    			}
    		};
    		if ( !support.checkOn ) {
    			jQuery.valHooks[ this ].get = function( elem ) {
    				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
    			};
    		}
    	} );




    	// Return jQuery for attributes-only inclusion


    	support.focusin = "onfocusin" in window;


    	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    		stopPropagationCallback = function( e ) {
    			e.stopPropagation();
    		};

    	jQuery.extend( jQuery.event, {

    		trigger: function( event, data, elem, onlyHandlers ) {

    			var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
    				eventPath = [ elem || document ],
    				type = hasOwn.call( event, "type" ) ? event.type : event,
    				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

    			cur = lastElement = tmp = elem = elem || document;

    			// Don't do events on text and comment nodes
    			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
    				return;
    			}

    			// focus/blur morphs to focusin/out; ensure we're not firing them right now
    			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
    				return;
    			}

    			if ( type.indexOf( "." ) > -1 ) {

    				// Namespaced trigger; create a regexp to match event type in handle()
    				namespaces = type.split( "." );
    				type = namespaces.shift();
    				namespaces.sort();
    			}
    			ontype = type.indexOf( ":" ) < 0 && "on" + type;

    			// Caller can pass in a jQuery.Event object, Object, or just an event type string
    			event = event[ jQuery.expando ] ?
    				event :
    				new jQuery.Event( type, typeof event === "object" && event );

    			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
    			event.isTrigger = onlyHandlers ? 2 : 3;
    			event.namespace = namespaces.join( "." );
    			event.rnamespace = event.namespace ?
    				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
    				null;

    			// Clean up the event in case it is being reused
    			event.result = undefined;
    			if ( !event.target ) {
    				event.target = elem;
    			}

    			// Clone any incoming data and prepend the event, creating the handler arg list
    			data = data == null ?
    				[ event ] :
    				jQuery.makeArray( data, [ event ] );

    			// Allow special events to draw outside the lines
    			special = jQuery.event.special[ type ] || {};
    			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
    				return;
    			}

    			// Determine event propagation path in advance, per W3C events spec (trac-9951)
    			// Bubble up to document, then to window; watch for a global ownerDocument var (trac-9724)
    			if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

    				bubbleType = special.delegateType || type;
    				if ( !rfocusMorph.test( bubbleType + type ) ) {
    					cur = cur.parentNode;
    				}
    				for ( ; cur; cur = cur.parentNode ) {
    					eventPath.push( cur );
    					tmp = cur;
    				}

    				// Only add window if we got to document (e.g., not plain obj or detached DOM)
    				if ( tmp === ( elem.ownerDocument || document ) ) {
    					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
    				}
    			}

    			// Fire handlers on the event path
    			i = 0;
    			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
    				lastElement = cur;
    				event.type = i > 1 ?
    					bubbleType :
    					special.bindType || type;

    				// jQuery handler
    				handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
    					dataPriv.get( cur, "handle" );
    				if ( handle ) {
    					handle.apply( cur, data );
    				}

    				// Native handler
    				handle = ontype && cur[ ontype ];
    				if ( handle && handle.apply && acceptData( cur ) ) {
    					event.result = handle.apply( cur, data );
    					if ( event.result === false ) {
    						event.preventDefault();
    					}
    				}
    			}
    			event.type = type;

    			// If nobody prevented the default action, do it now
    			if ( !onlyHandlers && !event.isDefaultPrevented() ) {

    				if ( ( !special._default ||
    					special._default.apply( eventPath.pop(), data ) === false ) &&
    					acceptData( elem ) ) {

    					// Call a native DOM method on the target with the same name as the event.
    					// Don't do default actions on window, that's where global variables be (trac-6170)
    					if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

    						// Don't re-trigger an onFOO event when we call its FOO() method
    						tmp = elem[ ontype ];

    						if ( tmp ) {
    							elem[ ontype ] = null;
    						}

    						// Prevent re-triggering of the same event, since we already bubbled it above
    						jQuery.event.triggered = type;

    						if ( event.isPropagationStopped() ) {
    							lastElement.addEventListener( type, stopPropagationCallback );
    						}

    						elem[ type ]();

    						if ( event.isPropagationStopped() ) {
    							lastElement.removeEventListener( type, stopPropagationCallback );
    						}

    						jQuery.event.triggered = undefined;

    						if ( tmp ) {
    							elem[ ontype ] = tmp;
    						}
    					}
    				}
    			}

    			return event.result;
    		},

    		// Piggyback on a donor event to simulate a different one
    		// Used only for `focus(in | out)` events
    		simulate: function( type, elem, event ) {
    			var e = jQuery.extend(
    				new jQuery.Event(),
    				event,
    				{
    					type: type,
    					isSimulated: true
    				}
    			);

    			jQuery.event.trigger( e, null, elem );
    		}

    	} );

    	jQuery.fn.extend( {

    		trigger: function( type, data ) {
    			return this.each( function() {
    				jQuery.event.trigger( type, data, this );
    			} );
    		},
    		triggerHandler: function( type, data ) {
    			var elem = this[ 0 ];
    			if ( elem ) {
    				return jQuery.event.trigger( type, data, elem, true );
    			}
    		}
    	} );


    	// Support: Firefox <=44
    	// Firefox doesn't have focus(in | out) events
    	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
    	//
    	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
    	// focus(in | out) events fire after focus & blur events,
    	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
    	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
    	if ( !support.focusin ) {
    		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

    			// Attach a single capturing handler on the document while someone wants focusin/focusout
    			var handler = function( event ) {
    				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
    			};

    			jQuery.event.special[ fix ] = {
    				setup: function() {

    					// Handle: regular nodes (via `this.ownerDocument`), window
    					// (via `this.document`) & document (via `this`).
    					var doc = this.ownerDocument || this.document || this,
    						attaches = dataPriv.access( doc, fix );

    					if ( !attaches ) {
    						doc.addEventListener( orig, handler, true );
    					}
    					dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
    				},
    				teardown: function() {
    					var doc = this.ownerDocument || this.document || this,
    						attaches = dataPriv.access( doc, fix ) - 1;

    					if ( !attaches ) {
    						doc.removeEventListener( orig, handler, true );
    						dataPriv.remove( doc, fix );

    					} else {
    						dataPriv.access( doc, fix, attaches );
    					}
    				}
    			};
    		} );
    	}
    	var location = window.location;

    	var nonce = { guid: Date.now() };

    	var rquery = ( /\?/ );



    	// Cross-browser xml parsing
    	jQuery.parseXML = function( data ) {
    		var xml, parserErrorElem;
    		if ( !data || typeof data !== "string" ) {
    			return null;
    		}

    		// Support: IE 9 - 11 only
    		// IE throws on parseFromString with invalid input.
    		try {
    			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
    		} catch ( e ) {}

    		parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
    		if ( !xml || parserErrorElem ) {
    			jQuery.error( "Invalid XML: " + (
    				parserErrorElem ?
    					jQuery.map( parserErrorElem.childNodes, function( el ) {
    						return el.textContent;
    					} ).join( "\n" ) :
    					data
    			) );
    		}
    		return xml;
    	};


    	var
    		rbracket = /\[\]$/,
    		rCRLF = /\r?\n/g,
    		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    		rsubmittable = /^(?:input|select|textarea|keygen)/i;

    	function buildParams( prefix, obj, traditional, add ) {
    		var name;

    		if ( Array.isArray( obj ) ) {

    			// Serialize array item.
    			jQuery.each( obj, function( i, v ) {
    				if ( traditional || rbracket.test( prefix ) ) {

    					// Treat each array item as a scalar.
    					add( prefix, v );

    				} else {

    					// Item is non-scalar (array or object), encode its numeric index.
    					buildParams(
    						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
    						v,
    						traditional,
    						add
    					);
    				}
    			} );

    		} else if ( !traditional && toType( obj ) === "object" ) {

    			// Serialize object item.
    			for ( name in obj ) {
    				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    			}

    		} else {

    			// Serialize scalar item.
    			add( prefix, obj );
    		}
    	}

    	// Serialize an array of form elements or a set of
    	// key/values into a query string
    	jQuery.param = function( a, traditional ) {
    		var prefix,
    			s = [],
    			add = function( key, valueOrFunction ) {

    				// If value is a function, invoke it and use its return value
    				var value = isFunction( valueOrFunction ) ?
    					valueOrFunction() :
    					valueOrFunction;

    				s[ s.length ] = encodeURIComponent( key ) + "=" +
    					encodeURIComponent( value == null ? "" : value );
    			};

    		if ( a == null ) {
    			return "";
    		}

    		// If an array was passed in, assume that it is an array of form elements.
    		if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

    			// Serialize the form elements
    			jQuery.each( a, function() {
    				add( this.name, this.value );
    			} );

    		} else {

    			// If traditional, encode the "old" way (the way 1.3.2 or older
    			// did it), otherwise encode params recursively.
    			for ( prefix in a ) {
    				buildParams( prefix, a[ prefix ], traditional, add );
    			}
    		}

    		// Return the resulting serialization
    		return s.join( "&" );
    	};

    	jQuery.fn.extend( {
    		serialize: function() {
    			return jQuery.param( this.serializeArray() );
    		},
    		serializeArray: function() {
    			return this.map( function() {

    				// Can add propHook for "elements" to filter or add form elements
    				var elements = jQuery.prop( this, "elements" );
    				return elements ? jQuery.makeArray( elements ) : this;
    			} ).filter( function() {
    				var type = this.type;

    				// Use .is( ":disabled" ) so that fieldset[disabled] works
    				return this.name && !jQuery( this ).is( ":disabled" ) &&
    					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
    					( this.checked || !rcheckableType.test( type ) );
    			} ).map( function( _i, elem ) {
    				var val = jQuery( this ).val();

    				if ( val == null ) {
    					return null;
    				}

    				if ( Array.isArray( val ) ) {
    					return jQuery.map( val, function( val ) {
    						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    					} );
    				}

    				return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    			} ).get();
    		}
    	} );


    	var
    		r20 = /%20/g,
    		rhash = /#.*$/,
    		rantiCache = /([?&])_=[^&]*/,
    		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

    		// trac-7653, trac-8125, trac-8152: local protocol detection
    		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    		rnoContent = /^(?:GET|HEAD)$/,
    		rprotocol = /^\/\//,

    		/* Prefilters
    		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
    		 * 2) These are called:
    		 *    - BEFORE asking for a transport
    		 *    - AFTER param serialization (s.data is a string if s.processData is true)
    		 * 3) key is the dataType
    		 * 4) the catchall symbol "*" can be used
    		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
    		 */
    		prefilters = {},

    		/* Transports bindings
    		 * 1) key is the dataType
    		 * 2) the catchall symbol "*" can be used
    		 * 3) selection will start with transport dataType and THEN go to "*" if needed
    		 */
    		transports = {},

    		// Avoid comment-prolog char sequence (trac-10098); must appease lint and evade compression
    		allTypes = "*/".concat( "*" ),

    		// Anchor tag for parsing the document origin
    		originAnchor = document.createElement( "a" );

    	originAnchor.href = location.href;

    	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    	function addToPrefiltersOrTransports( structure ) {

    		// dataTypeExpression is optional and defaults to "*"
    		return function( dataTypeExpression, func ) {

    			if ( typeof dataTypeExpression !== "string" ) {
    				func = dataTypeExpression;
    				dataTypeExpression = "*";
    			}

    			var dataType,
    				i = 0,
    				dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

    			if ( isFunction( func ) ) {

    				// For each dataType in the dataTypeExpression
    				while ( ( dataType = dataTypes[ i++ ] ) ) {

    					// Prepend if requested
    					if ( dataType[ 0 ] === "+" ) {
    						dataType = dataType.slice( 1 ) || "*";
    						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

    					// Otherwise append
    					} else {
    						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
    					}
    				}
    			}
    		};
    	}

    	// Base inspection function for prefilters and transports
    	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

    		var inspected = {},
    			seekingTransport = ( structure === transports );

    		function inspect( dataType ) {
    			var selected;
    			inspected[ dataType ] = true;
    			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
    				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
    				if ( typeof dataTypeOrTransport === "string" &&
    					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

    					options.dataTypes.unshift( dataTypeOrTransport );
    					inspect( dataTypeOrTransport );
    					return false;
    				} else if ( seekingTransport ) {
    					return !( selected = dataTypeOrTransport );
    				}
    			} );
    			return selected;
    		}

    		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
    	}

    	// A special extend for ajax options
    	// that takes "flat" options (not to be deep extended)
    	// Fixes trac-9887
    	function ajaxExtend( target, src ) {
    		var key, deep,
    			flatOptions = jQuery.ajaxSettings.flatOptions || {};

    		for ( key in src ) {
    			if ( src[ key ] !== undefined ) {
    				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
    			}
    		}
    		if ( deep ) {
    			jQuery.extend( true, target, deep );
    		}

    		return target;
    	}

    	/* Handles responses to an ajax request:
    	 * - finds the right dataType (mediates between content-type and expected dataType)
    	 * - returns the corresponding response
    	 */
    	function ajaxHandleResponses( s, jqXHR, responses ) {

    		var ct, type, finalDataType, firstDataType,
    			contents = s.contents,
    			dataTypes = s.dataTypes;

    		// Remove auto dataType and get content-type in the process
    		while ( dataTypes[ 0 ] === "*" ) {
    			dataTypes.shift();
    			if ( ct === undefined ) {
    				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
    			}
    		}

    		// Check if we're dealing with a known content-type
    		if ( ct ) {
    			for ( type in contents ) {
    				if ( contents[ type ] && contents[ type ].test( ct ) ) {
    					dataTypes.unshift( type );
    					break;
    				}
    			}
    		}

    		// Check to see if we have a response for the expected dataType
    		if ( dataTypes[ 0 ] in responses ) {
    			finalDataType = dataTypes[ 0 ];
    		} else {

    			// Try convertible dataTypes
    			for ( type in responses ) {
    				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
    					finalDataType = type;
    					break;
    				}
    				if ( !firstDataType ) {
    					firstDataType = type;
    				}
    			}

    			// Or just use first one
    			finalDataType = finalDataType || firstDataType;
    		}

    		// If we found a dataType
    		// We add the dataType to the list if needed
    		// and return the corresponding response
    		if ( finalDataType ) {
    			if ( finalDataType !== dataTypes[ 0 ] ) {
    				dataTypes.unshift( finalDataType );
    			}
    			return responses[ finalDataType ];
    		}
    	}

    	/* Chain conversions given the request and the original response
    	 * Also sets the responseXXX fields on the jqXHR instance
    	 */
    	function ajaxConvert( s, response, jqXHR, isSuccess ) {
    		var conv2, current, conv, tmp, prev,
    			converters = {},

    			// Work with a copy of dataTypes in case we need to modify it for conversion
    			dataTypes = s.dataTypes.slice();

    		// Create converters map with lowercased keys
    		if ( dataTypes[ 1 ] ) {
    			for ( conv in s.converters ) {
    				converters[ conv.toLowerCase() ] = s.converters[ conv ];
    			}
    		}

    		current = dataTypes.shift();

    		// Convert to each sequential dataType
    		while ( current ) {

    			if ( s.responseFields[ current ] ) {
    				jqXHR[ s.responseFields[ current ] ] = response;
    			}

    			// Apply the dataFilter if provided
    			if ( !prev && isSuccess && s.dataFilter ) {
    				response = s.dataFilter( response, s.dataType );
    			}

    			prev = current;
    			current = dataTypes.shift();

    			if ( current ) {

    				// There's only work to do if current dataType is non-auto
    				if ( current === "*" ) {

    					current = prev;

    				// Convert response if prev dataType is non-auto and differs from current
    				} else if ( prev !== "*" && prev !== current ) {

    					// Seek a direct converter
    					conv = converters[ prev + " " + current ] || converters[ "* " + current ];

    					// If none found, seek a pair
    					if ( !conv ) {
    						for ( conv2 in converters ) {

    							// If conv2 outputs current
    							tmp = conv2.split( " " );
    							if ( tmp[ 1 ] === current ) {

    								// If prev can be converted to accepted input
    								conv = converters[ prev + " " + tmp[ 0 ] ] ||
    									converters[ "* " + tmp[ 0 ] ];
    								if ( conv ) {

    									// Condense equivalence converters
    									if ( conv === true ) {
    										conv = converters[ conv2 ];

    									// Otherwise, insert the intermediate dataType
    									} else if ( converters[ conv2 ] !== true ) {
    										current = tmp[ 0 ];
    										dataTypes.unshift( tmp[ 1 ] );
    									}
    									break;
    								}
    							}
    						}
    					}

    					// Apply converter (if not an equivalence)
    					if ( conv !== true ) {

    						// Unless errors are allowed to bubble, catch and return them
    						if ( conv && s.throws ) {
    							response = conv( response );
    						} else {
    							try {
    								response = conv( response );
    							} catch ( e ) {
    								return {
    									state: "parsererror",
    									error: conv ? e : "No conversion from " + prev + " to " + current
    								};
    							}
    						}
    					}
    				}
    			}
    		}

    		return { state: "success", data: response };
    	}

    	jQuery.extend( {

    		// Counter for holding the number of active queries
    		active: 0,

    		// Last-Modified header cache for next request
    		lastModified: {},
    		etag: {},

    		ajaxSettings: {
    			url: location.href,
    			type: "GET",
    			isLocal: rlocalProtocol.test( location.protocol ),
    			global: true,
    			processData: true,
    			async: true,
    			contentType: "application/x-www-form-urlencoded; charset=UTF-8",

    			/*
    			timeout: 0,
    			data: null,
    			dataType: null,
    			username: null,
    			password: null,
    			cache: null,
    			throws: false,
    			traditional: false,
    			headers: {},
    			*/

    			accepts: {
    				"*": allTypes,
    				text: "text/plain",
    				html: "text/html",
    				xml: "application/xml, text/xml",
    				json: "application/json, text/javascript"
    			},

    			contents: {
    				xml: /\bxml\b/,
    				html: /\bhtml/,
    				json: /\bjson\b/
    			},

    			responseFields: {
    				xml: "responseXML",
    				text: "responseText",
    				json: "responseJSON"
    			},

    			// Data converters
    			// Keys separate source (or catchall "*") and destination types with a single space
    			converters: {

    				// Convert anything to text
    				"* text": String,

    				// Text to html (true = no transformation)
    				"text html": true,

    				// Evaluate text as a json expression
    				"text json": JSON.parse,

    				// Parse text as xml
    				"text xml": jQuery.parseXML
    			},

    			// For options that shouldn't be deep extended:
    			// you can add your own custom options here if
    			// and when you create one that shouldn't be
    			// deep extended (see ajaxExtend)
    			flatOptions: {
    				url: true,
    				context: true
    			}
    		},

    		// Creates a full fledged settings object into target
    		// with both ajaxSettings and settings fields.
    		// If target is omitted, writes into ajaxSettings.
    		ajaxSetup: function( target, settings ) {
    			return settings ?

    				// Building a settings object
    				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

    				// Extending ajaxSettings
    				ajaxExtend( jQuery.ajaxSettings, target );
    		},

    		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    		ajaxTransport: addToPrefiltersOrTransports( transports ),

    		// Main method
    		ajax: function( url, options ) {

    			// If url is an object, simulate pre-1.5 signature
    			if ( typeof url === "object" ) {
    				options = url;
    				url = undefined;
    			}

    			// Force options to be an object
    			options = options || {};

    			var transport,

    				// URL without anti-cache param
    				cacheURL,

    				// Response headers
    				responseHeadersString,
    				responseHeaders,

    				// timeout handle
    				timeoutTimer,

    				// Url cleanup var
    				urlAnchor,

    				// Request state (becomes false upon send and true upon completion)
    				completed,

    				// To know if global events are to be dispatched
    				fireGlobals,

    				// Loop variable
    				i,

    				// uncached part of the url
    				uncached,

    				// Create the final options object
    				s = jQuery.ajaxSetup( {}, options ),

    				// Callbacks context
    				callbackContext = s.context || s,

    				// Context for global events is callbackContext if it is a DOM node or jQuery collection
    				globalEventContext = s.context &&
    					( callbackContext.nodeType || callbackContext.jquery ) ?
    					jQuery( callbackContext ) :
    					jQuery.event,

    				// Deferreds
    				deferred = jQuery.Deferred(),
    				completeDeferred = jQuery.Callbacks( "once memory" ),

    				// Status-dependent callbacks
    				statusCode = s.statusCode || {},

    				// Headers (they are sent all at once)
    				requestHeaders = {},
    				requestHeadersNames = {},

    				// Default abort message
    				strAbort = "canceled",

    				// Fake xhr
    				jqXHR = {
    					readyState: 0,

    					// Builds headers hashtable if needed
    					getResponseHeader: function( key ) {
    						var match;
    						if ( completed ) {
    							if ( !responseHeaders ) {
    								responseHeaders = {};
    								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
    									responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
    										( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
    											.concat( match[ 2 ] );
    								}
    							}
    							match = responseHeaders[ key.toLowerCase() + " " ];
    						}
    						return match == null ? null : match.join( ", " );
    					},

    					// Raw string
    					getAllResponseHeaders: function() {
    						return completed ? responseHeadersString : null;
    					},

    					// Caches the header
    					setRequestHeader: function( name, value ) {
    						if ( completed == null ) {
    							name = requestHeadersNames[ name.toLowerCase() ] =
    								requestHeadersNames[ name.toLowerCase() ] || name;
    							requestHeaders[ name ] = value;
    						}
    						return this;
    					},

    					// Overrides response content-type header
    					overrideMimeType: function( type ) {
    						if ( completed == null ) {
    							s.mimeType = type;
    						}
    						return this;
    					},

    					// Status-dependent callbacks
    					statusCode: function( map ) {
    						var code;
    						if ( map ) {
    							if ( completed ) {

    								// Execute the appropriate callbacks
    								jqXHR.always( map[ jqXHR.status ] );
    							} else {

    								// Lazy-add the new callbacks in a way that preserves old ones
    								for ( code in map ) {
    									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
    								}
    							}
    						}
    						return this;
    					},

    					// Cancel the request
    					abort: function( statusText ) {
    						var finalText = statusText || strAbort;
    						if ( transport ) {
    							transport.abort( finalText );
    						}
    						done( 0, finalText );
    						return this;
    					}
    				};

    			// Attach deferreds
    			deferred.promise( jqXHR );

    			// Add protocol if not provided (prefilters might expect it)
    			// Handle falsy url in the settings object (trac-10093: consistency with old signature)
    			// We also use the url parameter if available
    			s.url = ( ( url || s.url || location.href ) + "" )
    				.replace( rprotocol, location.protocol + "//" );

    			// Alias method option to type as per ticket trac-12004
    			s.type = options.method || options.type || s.method || s.type;

    			// Extract dataTypes list
    			s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

    			// A cross-domain request is in order when the origin doesn't match the current origin.
    			if ( s.crossDomain == null ) {
    				urlAnchor = document.createElement( "a" );

    				// Support: IE <=8 - 11, Edge 12 - 15
    				// IE throws exception on accessing the href property if url is malformed,
    				// e.g. http://example.com:80x/
    				try {
    					urlAnchor.href = s.url;

    					// Support: IE <=8 - 11 only
    					// Anchor's host property isn't correctly set when s.url is relative
    					urlAnchor.href = urlAnchor.href;
    					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
    						urlAnchor.protocol + "//" + urlAnchor.host;
    				} catch ( e ) {

    					// If there is an error parsing the URL, assume it is crossDomain,
    					// it can be rejected by the transport if it is invalid
    					s.crossDomain = true;
    				}
    			}

    			// Convert data if not already a string
    			if ( s.data && s.processData && typeof s.data !== "string" ) {
    				s.data = jQuery.param( s.data, s.traditional );
    			}

    			// Apply prefilters
    			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

    			// If request was aborted inside a prefilter, stop there
    			if ( completed ) {
    				return jqXHR;
    			}

    			// We can fire global events as of now if asked to
    			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (trac-15118)
    			fireGlobals = jQuery.event && s.global;

    			// Watch for a new set of requests
    			if ( fireGlobals && jQuery.active++ === 0 ) {
    				jQuery.event.trigger( "ajaxStart" );
    			}

    			// Uppercase the type
    			s.type = s.type.toUpperCase();

    			// Determine if request has content
    			s.hasContent = !rnoContent.test( s.type );

    			// Save the URL in case we're toying with the If-Modified-Since
    			// and/or If-None-Match header later on
    			// Remove hash to simplify url manipulation
    			cacheURL = s.url.replace( rhash, "" );

    			// More options handling for requests with no content
    			if ( !s.hasContent ) {

    				// Remember the hash so we can put it back
    				uncached = s.url.slice( cacheURL.length );

    				// If data is available and should be processed, append data to url
    				if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
    					cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

    					// trac-9682: remove data so that it's not used in an eventual retry
    					delete s.data;
    				}

    				// Add or update anti-cache param if needed
    				if ( s.cache === false ) {
    					cacheURL = cacheURL.replace( rantiCache, "$1" );
    					uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
    						uncached;
    				}

    				// Put hash and anti-cache on the URL that will be requested (gh-1732)
    				s.url = cacheURL + uncached;

    			// Change '%20' to '+' if this is encoded form body content (gh-2658)
    			} else if ( s.data && s.processData &&
    				( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
    				s.data = s.data.replace( r20, "+" );
    			}

    			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    			if ( s.ifModified ) {
    				if ( jQuery.lastModified[ cacheURL ] ) {
    					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
    				}
    				if ( jQuery.etag[ cacheURL ] ) {
    					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
    				}
    			}

    			// Set the correct header, if data is being sent
    			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
    				jqXHR.setRequestHeader( "Content-Type", s.contentType );
    			}

    			// Set the Accepts header for the server, depending on the dataType
    			jqXHR.setRequestHeader(
    				"Accept",
    				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
    					s.accepts[ s.dataTypes[ 0 ] ] +
    						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
    					s.accepts[ "*" ]
    			);

    			// Check for headers option
    			for ( i in s.headers ) {
    				jqXHR.setRequestHeader( i, s.headers[ i ] );
    			}

    			// Allow custom headers/mimetypes and early abort
    			if ( s.beforeSend &&
    				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

    				// Abort if not done already and return
    				return jqXHR.abort();
    			}

    			// Aborting is no longer a cancellation
    			strAbort = "abort";

    			// Install callbacks on deferreds
    			completeDeferred.add( s.complete );
    			jqXHR.done( s.success );
    			jqXHR.fail( s.error );

    			// Get transport
    			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

    			// If no transport, we auto-abort
    			if ( !transport ) {
    				done( -1, "No Transport" );
    			} else {
    				jqXHR.readyState = 1;

    				// Send global event
    				if ( fireGlobals ) {
    					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
    				}

    				// If request was aborted inside ajaxSend, stop there
    				if ( completed ) {
    					return jqXHR;
    				}

    				// Timeout
    				if ( s.async && s.timeout > 0 ) {
    					timeoutTimer = window.setTimeout( function() {
    						jqXHR.abort( "timeout" );
    					}, s.timeout );
    				}

    				try {
    					completed = false;
    					transport.send( requestHeaders, done );
    				} catch ( e ) {

    					// Rethrow post-completion exceptions
    					if ( completed ) {
    						throw e;
    					}

    					// Propagate others as results
    					done( -1, e );
    				}
    			}

    			// Callback for when everything is done
    			function done( status, nativeStatusText, responses, headers ) {
    				var isSuccess, success, error, response, modified,
    					statusText = nativeStatusText;

    				// Ignore repeat invocations
    				if ( completed ) {
    					return;
    				}

    				completed = true;

    				// Clear timeout if it exists
    				if ( timeoutTimer ) {
    					window.clearTimeout( timeoutTimer );
    				}

    				// Dereference transport for early garbage collection
    				// (no matter how long the jqXHR object will be used)
    				transport = undefined;

    				// Cache response headers
    				responseHeadersString = headers || "";

    				// Set readyState
    				jqXHR.readyState = status > 0 ? 4 : 0;

    				// Determine if successful
    				isSuccess = status >= 200 && status < 300 || status === 304;

    				// Get response data
    				if ( responses ) {
    					response = ajaxHandleResponses( s, jqXHR, responses );
    				}

    				// Use a noop converter for missing script but not if jsonp
    				if ( !isSuccess &&
    					jQuery.inArray( "script", s.dataTypes ) > -1 &&
    					jQuery.inArray( "json", s.dataTypes ) < 0 ) {
    					s.converters[ "text script" ] = function() {};
    				}

    				// Convert no matter what (that way responseXXX fields are always set)
    				response = ajaxConvert( s, response, jqXHR, isSuccess );

    				// If successful, handle type chaining
    				if ( isSuccess ) {

    					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    					if ( s.ifModified ) {
    						modified = jqXHR.getResponseHeader( "Last-Modified" );
    						if ( modified ) {
    							jQuery.lastModified[ cacheURL ] = modified;
    						}
    						modified = jqXHR.getResponseHeader( "etag" );
    						if ( modified ) {
    							jQuery.etag[ cacheURL ] = modified;
    						}
    					}

    					// if no content
    					if ( status === 204 || s.type === "HEAD" ) {
    						statusText = "nocontent";

    					// if not modified
    					} else if ( status === 304 ) {
    						statusText = "notmodified";

    					// If we have data, let's convert it
    					} else {
    						statusText = response.state;
    						success = response.data;
    						error = response.error;
    						isSuccess = !error;
    					}
    				} else {

    					// Extract error from statusText and normalize for non-aborts
    					error = statusText;
    					if ( status || !statusText ) {
    						statusText = "error";
    						if ( status < 0 ) {
    							status = 0;
    						}
    					}
    				}

    				// Set data for the fake xhr object
    				jqXHR.status = status;
    				jqXHR.statusText = ( nativeStatusText || statusText ) + "";

    				// Success/Error
    				if ( isSuccess ) {
    					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
    				} else {
    					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
    				}

    				// Status-dependent callbacks
    				jqXHR.statusCode( statusCode );
    				statusCode = undefined;

    				if ( fireGlobals ) {
    					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
    						[ jqXHR, s, isSuccess ? success : error ] );
    				}

    				// Complete
    				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

    				if ( fireGlobals ) {
    					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

    					// Handle the global AJAX counter
    					if ( !( --jQuery.active ) ) {
    						jQuery.event.trigger( "ajaxStop" );
    					}
    				}
    			}

    			return jqXHR;
    		},

    		getJSON: function( url, data, callback ) {
    			return jQuery.get( url, data, callback, "json" );
    		},

    		getScript: function( url, callback ) {
    			return jQuery.get( url, undefined, callback, "script" );
    		}
    	} );

    	jQuery.each( [ "get", "post" ], function( _i, method ) {
    		jQuery[ method ] = function( url, data, callback, type ) {

    			// Shift arguments if data argument was omitted
    			if ( isFunction( data ) ) {
    				type = type || callback;
    				callback = data;
    				data = undefined;
    			}

    			// The url can be an options object (which then must have .url)
    			return jQuery.ajax( jQuery.extend( {
    				url: url,
    				type: method,
    				dataType: type,
    				data: data,
    				success: callback
    			}, jQuery.isPlainObject( url ) && url ) );
    		};
    	} );

    	jQuery.ajaxPrefilter( function( s ) {
    		var i;
    		for ( i in s.headers ) {
    			if ( i.toLowerCase() === "content-type" ) {
    				s.contentType = s.headers[ i ] || "";
    			}
    		}
    	} );


    	jQuery._evalUrl = function( url, options, doc ) {
    		return jQuery.ajax( {
    			url: url,

    			// Make this explicit, since user can override this through ajaxSetup (trac-11264)
    			type: "GET",
    			dataType: "script",
    			cache: true,
    			async: false,
    			global: false,

    			// Only evaluate the response if it is successful (gh-4126)
    			// dataFilter is not invoked for failure responses, so using it instead
    			// of the default converter is kludgy but it works.
    			converters: {
    				"text script": function() {}
    			},
    			dataFilter: function( response ) {
    				jQuery.globalEval( response, options, doc );
    			}
    		} );
    	};


    	jQuery.fn.extend( {
    		wrapAll: function( html ) {
    			var wrap;

    			if ( this[ 0 ] ) {
    				if ( isFunction( html ) ) {
    					html = html.call( this[ 0 ] );
    				}

    				// The elements to wrap the target around
    				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

    				if ( this[ 0 ].parentNode ) {
    					wrap.insertBefore( this[ 0 ] );
    				}

    				wrap.map( function() {
    					var elem = this;

    					while ( elem.firstElementChild ) {
    						elem = elem.firstElementChild;
    					}

    					return elem;
    				} ).append( this );
    			}

    			return this;
    		},

    		wrapInner: function( html ) {
    			if ( isFunction( html ) ) {
    				return this.each( function( i ) {
    					jQuery( this ).wrapInner( html.call( this, i ) );
    				} );
    			}

    			return this.each( function() {
    				var self = jQuery( this ),
    					contents = self.contents();

    				if ( contents.length ) {
    					contents.wrapAll( html );

    				} else {
    					self.append( html );
    				}
    			} );
    		},

    		wrap: function( html ) {
    			var htmlIsFunction = isFunction( html );

    			return this.each( function( i ) {
    				jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
    			} );
    		},

    		unwrap: function( selector ) {
    			this.parent( selector ).not( "body" ).each( function() {
    				jQuery( this ).replaceWith( this.childNodes );
    			} );
    			return this;
    		}
    	} );


    	jQuery.expr.pseudos.hidden = function( elem ) {
    		return !jQuery.expr.pseudos.visible( elem );
    	};
    	jQuery.expr.pseudos.visible = function( elem ) {
    		return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
    	};




    	jQuery.ajaxSettings.xhr = function() {
    		try {
    			return new window.XMLHttpRequest();
    		} catch ( e ) {}
    	};

    	var xhrSuccessStatus = {

    			// File protocol always yields status code 0, assume 200
    			0: 200,

    			// Support: IE <=9 only
    			// trac-1450: sometimes IE returns 1223 when it should be 204
    			1223: 204
    		},
    		xhrSupported = jQuery.ajaxSettings.xhr();

    	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
    	support.ajax = xhrSupported = !!xhrSupported;

    	jQuery.ajaxTransport( function( options ) {
    		var callback, errorCallback;

    		// Cross domain only allowed if supported through XMLHttpRequest
    		if ( support.cors || xhrSupported && !options.crossDomain ) {
    			return {
    				send: function( headers, complete ) {
    					var i,
    						xhr = options.xhr();

    					xhr.open(
    						options.type,
    						options.url,
    						options.async,
    						options.username,
    						options.password
    					);

    					// Apply custom fields if provided
    					if ( options.xhrFields ) {
    						for ( i in options.xhrFields ) {
    							xhr[ i ] = options.xhrFields[ i ];
    						}
    					}

    					// Override mime type if needed
    					if ( options.mimeType && xhr.overrideMimeType ) {
    						xhr.overrideMimeType( options.mimeType );
    					}

    					// X-Requested-With header
    					// For cross-domain requests, seeing as conditions for a preflight are
    					// akin to a jigsaw puzzle, we simply never set it to be sure.
    					// (it can always be set on a per-request basis or even using ajaxSetup)
    					// For same-domain requests, won't change header if already provided.
    					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
    						headers[ "X-Requested-With" ] = "XMLHttpRequest";
    					}

    					// Set headers
    					for ( i in headers ) {
    						xhr.setRequestHeader( i, headers[ i ] );
    					}

    					// Callback
    					callback = function( type ) {
    						return function() {
    							if ( callback ) {
    								callback = errorCallback = xhr.onload =
    									xhr.onerror = xhr.onabort = xhr.ontimeout =
    										xhr.onreadystatechange = null;

    								if ( type === "abort" ) {
    									xhr.abort();
    								} else if ( type === "error" ) {

    									// Support: IE <=9 only
    									// On a manual native abort, IE9 throws
    									// errors on any property access that is not readyState
    									if ( typeof xhr.status !== "number" ) {
    										complete( 0, "error" );
    									} else {
    										complete(

    											// File: protocol always yields status 0; see trac-8605, trac-14207
    											xhr.status,
    											xhr.statusText
    										);
    									}
    								} else {
    									complete(
    										xhrSuccessStatus[ xhr.status ] || xhr.status,
    										xhr.statusText,

    										// Support: IE <=9 only
    										// IE9 has no XHR2 but throws on binary (trac-11426)
    										// For XHR2 non-text, let the caller handle it (gh-2498)
    										( xhr.responseType || "text" ) !== "text"  ||
    										typeof xhr.responseText !== "string" ?
    											{ binary: xhr.response } :
    											{ text: xhr.responseText },
    										xhr.getAllResponseHeaders()
    									);
    								}
    							}
    						};
    					};

    					// Listen to events
    					xhr.onload = callback();
    					errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

    					// Support: IE 9 only
    					// Use onreadystatechange to replace onabort
    					// to handle uncaught aborts
    					if ( xhr.onabort !== undefined ) {
    						xhr.onabort = errorCallback;
    					} else {
    						xhr.onreadystatechange = function() {

    							// Check readyState before timeout as it changes
    							if ( xhr.readyState === 4 ) {

    								// Allow onerror to be called first,
    								// but that will not handle a native abort
    								// Also, save errorCallback to a variable
    								// as xhr.onerror cannot be accessed
    								window.setTimeout( function() {
    									if ( callback ) {
    										errorCallback();
    									}
    								} );
    							}
    						};
    					}

    					// Create the abort callback
    					callback = callback( "abort" );

    					try {

    						// Do send the request (this may raise an exception)
    						xhr.send( options.hasContent && options.data || null );
    					} catch ( e ) {

    						// trac-14683: Only rethrow if this hasn't been notified as an error yet
    						if ( callback ) {
    							throw e;
    						}
    					}
    				},

    				abort: function() {
    					if ( callback ) {
    						callback();
    					}
    				}
    			};
    		}
    	} );




    	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
    	jQuery.ajaxPrefilter( function( s ) {
    		if ( s.crossDomain ) {
    			s.contents.script = false;
    		}
    	} );

    	// Install script dataType
    	jQuery.ajaxSetup( {
    		accepts: {
    			script: "text/javascript, application/javascript, " +
    				"application/ecmascript, application/x-ecmascript"
    		},
    		contents: {
    			script: /\b(?:java|ecma)script\b/
    		},
    		converters: {
    			"text script": function( text ) {
    				jQuery.globalEval( text );
    				return text;
    			}
    		}
    	} );

    	// Handle cache's special case and crossDomain
    	jQuery.ajaxPrefilter( "script", function( s ) {
    		if ( s.cache === undefined ) {
    			s.cache = false;
    		}
    		if ( s.crossDomain ) {
    			s.type = "GET";
    		}
    	} );

    	// Bind script tag hack transport
    	jQuery.ajaxTransport( "script", function( s ) {

    		// This transport only deals with cross domain or forced-by-attrs requests
    		if ( s.crossDomain || s.scriptAttrs ) {
    			var script, callback;
    			return {
    				send: function( _, complete ) {
    					script = jQuery( "<script>" )
    						.attr( s.scriptAttrs || {} )
    						.prop( { charset: s.scriptCharset, src: s.url } )
    						.on( "load error", callback = function( evt ) {
    							script.remove();
    							callback = null;
    							if ( evt ) {
    								complete( evt.type === "error" ? 404 : 200, evt.type );
    							}
    						} );

    					// Use native DOM manipulation to avoid our domManip AJAX trickery
    					document.head.appendChild( script[ 0 ] );
    				},
    				abort: function() {
    					if ( callback ) {
    						callback();
    					}
    				}
    			};
    		}
    	} );




    	var oldCallbacks = [],
    		rjsonp = /(=)\?(?=&|$)|\?\?/;

    	// Default jsonp settings
    	jQuery.ajaxSetup( {
    		jsonp: "callback",
    		jsonpCallback: function() {
    			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
    			this[ callback ] = true;
    			return callback;
    		}
    	} );

    	// Detect, normalize options and install callbacks for jsonp requests
    	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    		var callbackName, overwritten, responseContainer,
    			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
    				"url" :
    				typeof s.data === "string" &&
    					( s.contentType || "" )
    						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
    					rjsonp.test( s.data ) && "data"
    			);

    		// Handle iff the expected data type is "jsonp" or we have a parameter to set
    		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

    			// Get callback name, remembering preexisting value associated with it
    			callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
    				s.jsonpCallback() :
    				s.jsonpCallback;

    			// Insert callback into url or form data
    			if ( jsonProp ) {
    				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
    			} else if ( s.jsonp !== false ) {
    				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
    			}

    			// Use data converter to retrieve json after script execution
    			s.converters[ "script json" ] = function() {
    				if ( !responseContainer ) {
    					jQuery.error( callbackName + " was not called" );
    				}
    				return responseContainer[ 0 ];
    			};

    			// Force json dataType
    			s.dataTypes[ 0 ] = "json";

    			// Install callback
    			overwritten = window[ callbackName ];
    			window[ callbackName ] = function() {
    				responseContainer = arguments;
    			};

    			// Clean-up function (fires after converters)
    			jqXHR.always( function() {

    				// If previous value didn't exist - remove it
    				if ( overwritten === undefined ) {
    					jQuery( window ).removeProp( callbackName );

    				// Otherwise restore preexisting value
    				} else {
    					window[ callbackName ] = overwritten;
    				}

    				// Save back as free
    				if ( s[ callbackName ] ) {

    					// Make sure that re-using the options doesn't screw things around
    					s.jsonpCallback = originalSettings.jsonpCallback;

    					// Save the callback name for future use
    					oldCallbacks.push( callbackName );
    				}

    				// Call if it was a function and we have a response
    				if ( responseContainer && isFunction( overwritten ) ) {
    					overwritten( responseContainer[ 0 ] );
    				}

    				responseContainer = overwritten = undefined;
    			} );

    			// Delegate to script
    			return "script";
    		}
    	} );




    	// Support: Safari 8 only
    	// In Safari 8 documents created via document.implementation.createHTMLDocument
    	// collapse sibling forms: the second one becomes a child of the first one.
    	// Because of that, this security measure has to be disabled in Safari 8.
    	// https://bugs.webkit.org/show_bug.cgi?id=137337
    	support.createHTMLDocument = ( function() {
    		var body = document.implementation.createHTMLDocument( "" ).body;
    		body.innerHTML = "<form></form><form></form>";
    		return body.childNodes.length === 2;
    	} )();


    	// Argument "data" should be string of html
    	// context (optional): If specified, the fragment will be created in this context,
    	// defaults to document
    	// keepScripts (optional): If true, will include scripts passed in the html string
    	jQuery.parseHTML = function( data, context, keepScripts ) {
    		if ( typeof data !== "string" ) {
    			return [];
    		}
    		if ( typeof context === "boolean" ) {
    			keepScripts = context;
    			context = false;
    		}

    		var base, parsed, scripts;

    		if ( !context ) {

    			// Stop scripts or inline event handlers from being executed immediately
    			// by using document.implementation
    			if ( support.createHTMLDocument ) {
    				context = document.implementation.createHTMLDocument( "" );

    				// Set the base href for the created document
    				// so any parsed elements with URLs
    				// are based on the document's URL (gh-2965)
    				base = context.createElement( "base" );
    				base.href = document.location.href;
    				context.head.appendChild( base );
    			} else {
    				context = document;
    			}
    		}

    		parsed = rsingleTag.exec( data );
    		scripts = !keepScripts && [];

    		// Single tag
    		if ( parsed ) {
    			return [ context.createElement( parsed[ 1 ] ) ];
    		}

    		parsed = buildFragment( [ data ], context, scripts );

    		if ( scripts && scripts.length ) {
    			jQuery( scripts ).remove();
    		}

    		return jQuery.merge( [], parsed.childNodes );
    	};


    	/**
    	 * Load a url into a page
    	 */
    	jQuery.fn.load = function( url, params, callback ) {
    		var selector, type, response,
    			self = this,
    			off = url.indexOf( " " );

    		if ( off > -1 ) {
    			selector = stripAndCollapse( url.slice( off ) );
    			url = url.slice( 0, off );
    		}

    		// If it's a function
    		if ( isFunction( params ) ) {

    			// We assume that it's the callback
    			callback = params;
    			params = undefined;

    		// Otherwise, build a param string
    		} else if ( params && typeof params === "object" ) {
    			type = "POST";
    		}

    		// If we have elements to modify, make the request
    		if ( self.length > 0 ) {
    			jQuery.ajax( {
    				url: url,

    				// If "type" variable is undefined, then "GET" method will be used.
    				// Make value of this field explicit since
    				// user can override it through ajaxSetup method
    				type: type || "GET",
    				dataType: "html",
    				data: params
    			} ).done( function( responseText ) {

    				// Save response for use in complete callback
    				response = arguments;

    				self.html( selector ?

    					// If a selector was specified, locate the right elements in a dummy div
    					// Exclude scripts to avoid IE 'Permission Denied' errors
    					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

    					// Otherwise use the full result
    					responseText );

    			// If the request succeeds, this function gets "data", "status", "jqXHR"
    			// but they are ignored because response was set above.
    			// If it fails, this function gets "jqXHR", "status", "error"
    			} ).always( callback && function( jqXHR, status ) {
    				self.each( function() {
    					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
    				} );
    			} );
    		}

    		return this;
    	};




    	jQuery.expr.pseudos.animated = function( elem ) {
    		return jQuery.grep( jQuery.timers, function( fn ) {
    			return elem === fn.elem;
    		} ).length;
    	};




    	jQuery.offset = {
    		setOffset: function( elem, options, i ) {
    			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
    				position = jQuery.css( elem, "position" ),
    				curElem = jQuery( elem ),
    				props = {};

    			// Set position first, in-case top/left are set even on static elem
    			if ( position === "static" ) {
    				elem.style.position = "relative";
    			}

    			curOffset = curElem.offset();
    			curCSSTop = jQuery.css( elem, "top" );
    			curCSSLeft = jQuery.css( elem, "left" );
    			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
    				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

    			// Need to be able to calculate position if either
    			// top or left is auto and position is either absolute or fixed
    			if ( calculatePosition ) {
    				curPosition = curElem.position();
    				curTop = curPosition.top;
    				curLeft = curPosition.left;

    			} else {
    				curTop = parseFloat( curCSSTop ) || 0;
    				curLeft = parseFloat( curCSSLeft ) || 0;
    			}

    			if ( isFunction( options ) ) {

    				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
    				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
    			}

    			if ( options.top != null ) {
    				props.top = ( options.top - curOffset.top ) + curTop;
    			}
    			if ( options.left != null ) {
    				props.left = ( options.left - curOffset.left ) + curLeft;
    			}

    			if ( "using" in options ) {
    				options.using.call( elem, props );

    			} else {
    				curElem.css( props );
    			}
    		}
    	};

    	jQuery.fn.extend( {

    		// offset() relates an element's border box to the document origin
    		offset: function( options ) {

    			// Preserve chaining for setter
    			if ( arguments.length ) {
    				return options === undefined ?
    					this :
    					this.each( function( i ) {
    						jQuery.offset.setOffset( this, options, i );
    					} );
    			}

    			var rect, win,
    				elem = this[ 0 ];

    			if ( !elem ) {
    				return;
    			}

    			// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    			// Support: IE <=11 only
    			// Running getBoundingClientRect on a
    			// disconnected node in IE throws an error
    			if ( !elem.getClientRects().length ) {
    				return { top: 0, left: 0 };
    			}

    			// Get document-relative position by adding viewport scroll to viewport-relative gBCR
    			rect = elem.getBoundingClientRect();
    			win = elem.ownerDocument.defaultView;
    			return {
    				top: rect.top + win.pageYOffset,
    				left: rect.left + win.pageXOffset
    			};
    		},

    		// position() relates an element's margin box to its offset parent's padding box
    		// This corresponds to the behavior of CSS absolute positioning
    		position: function() {
    			if ( !this[ 0 ] ) {
    				return;
    			}

    			var offsetParent, offset, doc,
    				elem = this[ 0 ],
    				parentOffset = { top: 0, left: 0 };

    			// position:fixed elements are offset from the viewport, which itself always has zero offset
    			if ( jQuery.css( elem, "position" ) === "fixed" ) {

    				// Assume position:fixed implies availability of getBoundingClientRect
    				offset = elem.getBoundingClientRect();

    			} else {
    				offset = this.offset();

    				// Account for the *real* offset parent, which can be the document or its root element
    				// when a statically positioned element is identified
    				doc = elem.ownerDocument;
    				offsetParent = elem.offsetParent || doc.documentElement;
    				while ( offsetParent &&
    					( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
    					jQuery.css( offsetParent, "position" ) === "static" ) {

    					offsetParent = offsetParent.parentNode;
    				}
    				if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

    					// Incorporate borders into its offset, since they are outside its content origin
    					parentOffset = jQuery( offsetParent ).offset();
    					parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
    					parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
    				}
    			}

    			// Subtract parent offsets and element margins
    			return {
    				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
    				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
    			};
    		},

    		// This method will return documentElement in the following cases:
    		// 1) For the element inside the iframe without offsetParent, this method will return
    		//    documentElement of the parent window
    		// 2) For the hidden or detached element
    		// 3) For body or html element, i.e. in case of the html node - it will return itself
    		//
    		// but those exceptions were never presented as a real life use-cases
    		// and might be considered as more preferable results.
    		//
    		// This logic, however, is not guaranteed and can change at any point in the future
    		offsetParent: function() {
    			return this.map( function() {
    				var offsetParent = this.offsetParent;

    				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
    					offsetParent = offsetParent.offsetParent;
    				}

    				return offsetParent || documentElement;
    			} );
    		}
    	} );

    	// Create scrollLeft and scrollTop methods
    	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
    		var top = "pageYOffset" === prop;

    		jQuery.fn[ method ] = function( val ) {
    			return access( this, function( elem, method, val ) {

    				// Coalesce documents and windows
    				var win;
    				if ( isWindow( elem ) ) {
    					win = elem;
    				} else if ( elem.nodeType === 9 ) {
    					win = elem.defaultView;
    				}

    				if ( val === undefined ) {
    					return win ? win[ prop ] : elem[ method ];
    				}

    				if ( win ) {
    					win.scrollTo(
    						!top ? val : win.pageXOffset,
    						top ? val : win.pageYOffset
    					);

    				} else {
    					elem[ method ] = val;
    				}
    			}, method, val, arguments.length );
    		};
    	} );

    	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
    	// Add the top/left cssHooks using jQuery.fn.position
    	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
    	// getComputedStyle returns percent when specified for top/left/bottom/right;
    	// rather than make the css module depend on the offset module, just check for it here
    	jQuery.each( [ "top", "left" ], function( _i, prop ) {
    		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
    			function( elem, computed ) {
    				if ( computed ) {
    					computed = curCSS( elem, prop );

    					// If curCSS returns percentage, fallback to offset
    					return rnumnonpx.test( computed ) ?
    						jQuery( elem ).position()[ prop ] + "px" :
    						computed;
    				}
    			}
    		);
    	} );


    	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
    		jQuery.each( {
    			padding: "inner" + name,
    			content: type,
    			"": "outer" + name
    		}, function( defaultExtra, funcName ) {

    			// Margin is only for outerHeight, outerWidth
    			jQuery.fn[ funcName ] = function( margin, value ) {
    				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
    					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

    				return access( this, function( elem, type, value ) {
    					var doc;

    					if ( isWindow( elem ) ) {

    						// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
    						return funcName.indexOf( "outer" ) === 0 ?
    							elem[ "inner" + name ] :
    							elem.document.documentElement[ "client" + name ];
    					}

    					// Get document width or height
    					if ( elem.nodeType === 9 ) {
    						doc = elem.documentElement;

    						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
    						// whichever is greatest
    						return Math.max(
    							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
    							elem.body[ "offset" + name ], doc[ "offset" + name ],
    							doc[ "client" + name ]
    						);
    					}

    					return value === undefined ?

    						// Get width or height on the element, requesting but not forcing parseFloat
    						jQuery.css( elem, type, extra ) :

    						// Set width or height on the element
    						jQuery.style( elem, type, value, extra );
    				}, type, chainable ? margin : undefined, chainable );
    			};
    		} );
    	} );


    	jQuery.each( [
    		"ajaxStart",
    		"ajaxStop",
    		"ajaxComplete",
    		"ajaxError",
    		"ajaxSuccess",
    		"ajaxSend"
    	], function( _i, type ) {
    		jQuery.fn[ type ] = function( fn ) {
    			return this.on( type, fn );
    		};
    	} );




    	jQuery.fn.extend( {

    		bind: function( types, data, fn ) {
    			return this.on( types, null, data, fn );
    		},
    		unbind: function( types, fn ) {
    			return this.off( types, null, fn );
    		},

    		delegate: function( selector, types, data, fn ) {
    			return this.on( types, selector, data, fn );
    		},
    		undelegate: function( selector, types, fn ) {

    			// ( namespace ) or ( selector, types [, fn] )
    			return arguments.length === 1 ?
    				this.off( selector, "**" ) :
    				this.off( types, selector || "**", fn );
    		},

    		hover: function( fnOver, fnOut ) {
    			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    		}
    	} );

    	jQuery.each(
    		( "blur focus focusin focusout resize scroll click dblclick " +
    		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    		"change select submit keydown keypress keyup contextmenu" ).split( " " ),
    		function( _i, name ) {

    			// Handle event binding
    			jQuery.fn[ name ] = function( data, fn ) {
    				return arguments.length > 0 ?
    					this.on( name, null, data, fn ) :
    					this.trigger( name );
    			};
    		}
    	);




    	// Support: Android <=4.0 only
    	// Make sure we trim BOM and NBSP
    	// Require that the "whitespace run" starts from a non-whitespace
    	// to avoid O(N^2) behavior when the engine would try matching "\s+$" at each space position.
    	var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

    	// Bind a function to a context, optionally partially applying any
    	// arguments.
    	// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
    	// However, it is not slated for removal any time soon
    	jQuery.proxy = function( fn, context ) {
    		var tmp, args, proxy;

    		if ( typeof context === "string" ) {
    			tmp = fn[ context ];
    			context = fn;
    			fn = tmp;
    		}

    		// Quick check to determine if target is callable, in the spec
    		// this throws a TypeError, but we will just return undefined.
    		if ( !isFunction( fn ) ) {
    			return undefined;
    		}

    		// Simulated bind
    		args = slice.call( arguments, 2 );
    		proxy = function() {
    			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
    		};

    		// Set the guid of unique handler to the same of original handler, so it can be removed
    		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

    		return proxy;
    	};

    	jQuery.holdReady = function( hold ) {
    		if ( hold ) {
    			jQuery.readyWait++;
    		} else {
    			jQuery.ready( true );
    		}
    	};
    	jQuery.isArray = Array.isArray;
    	jQuery.parseJSON = JSON.parse;
    	jQuery.nodeName = nodeName;
    	jQuery.isFunction = isFunction;
    	jQuery.isWindow = isWindow;
    	jQuery.camelCase = camelCase;
    	jQuery.type = toType;

    	jQuery.now = Date.now;

    	jQuery.isNumeric = function( obj ) {

    		// As of jQuery 3.0, isNumeric is limited to
    		// strings and numbers (primitives or objects)
    		// that can be coerced to finite numbers (gh-2662)
    		var type = jQuery.type( obj );
    		return ( type === "number" || type === "string" ) &&

    			// parseFloat NaNs numeric-cast false positives ("")
    			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    			// subtraction forces infinities to NaN
    			!isNaN( obj - parseFloat( obj ) );
    	};

    	jQuery.trim = function( text ) {
    		return text == null ?
    			"" :
    			( text + "" ).replace( rtrim, "$1" );
    	};




    	var

    		// Map over jQuery in case of overwrite
    		_jQuery = window.jQuery,

    		// Map over the $ in case of overwrite
    		_$ = window.$;

    	jQuery.noConflict = function( deep ) {
    		if ( window.$ === jQuery ) {
    			window.$ = _$;
    		}

    		if ( deep && window.jQuery === jQuery ) {
    			window.jQuery = _jQuery;
    		}

    		return jQuery;
    	};

    	// Expose jQuery and $ identifiers, even in AMD
    	// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
    	// and CommonJS for browser emulators (trac-13566)
    	if ( typeof noGlobal === "undefined" ) {
    		window.jQuery = window.$ = jQuery;
    	}




    	return jQuery;
    	} );
    } (jquery));

    var jQuery = jqueryExports;

    /* src/components/NewEvent.svelte generated by Svelte v3.55.1 */

    const { Object: Object_1, console: console_1, document: document_1 } = globals;
    const file$4 = "src/components/NewEvent.svelte";

    // (122:4) {#if hasError == true}
    function create_if_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `${errMessage}`;
    			attr_dev(p, "class", "error-alert svelte-fu9j4h");
    			add_location(p, file$4, 122, 8, 6698);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(122:4) {#if hasError == true}",
    		ctx
    	});

    	return block;
    }

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
    	let form;
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
    	let t55;
    	let mounted;
    	let dispose;
    	let if_block = /*hasError*/ ctx[2] == true && create_if_block(ctx);

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
    			form = element("form");
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
    			t55 = space();
    			if (if_block) if_block.c();
    			attr_dev(link0, "href", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css");
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "integrity", "sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ");
    			attr_dev(link0, "crossorigin", "anonymous");
    			add_location(link0, file$4, 1, 1, 15);
    			attr_dev(script, "type", "module");
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/esm/inclusive-dates.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$4, 51, 2, 1867);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/themes/light.css");
    			add_location(link1, file$4, 57, 2, 2026);
    			add_location(head, file$4, 50, 0, 1858);
    			add_location(h1, file$4, 64, 4, 2156);
    			add_location(h20, file$4, 67, 52, 2332);
    			attr_dev(label0, "for", "event-name");
    			attr_dev(label0, "alt", "required");
    			add_location(label0, file$4, 67, 13, 2293);
    			add_location(div0, file$4, 67, 8, 2288);
    			attr_dev(input, "class", "form-control svelte-fu9j4h");
    			input.required = true;
    			attr_dev(input, "aria-required", "”true”");
    			attr_dev(input, "id", "event-name");
    			attr_dev(input, "oninvalid", "this.setCustomValidity('Please enter event name.')");
    			attr_dev(input, "oninput", "setCustomValidity('')");
    			add_location(input, file$4, 68, 8, 2374);
    			attr_dev(div1, "class", "form-element svelte-fu9j4h");
    			add_location(div1, file$4, 66, 4, 2253);
    			add_location(h21, file$4, 71, 37, 2646);
    			attr_dev(label1, "for", "date-range");
    			add_location(label1, file$4, 71, 13, 2622);
    			add_location(div2, file$4, 71, 8, 2617);
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
    			add_location(inclusive_dates, file$4, 72, 8, 2697);
    			attr_dev(div3, "class", "form-element svelte-fu9j4h");
    			add_location(div3, file$4, 70, 4, 2582);
    			add_location(h22, file$4, 75, 43, 3040);
    			attr_dev(label2, "for", "time-zone-offset");
    			add_location(label2, file$4, 75, 13, 3010);
    			add_location(div4, file$4, 75, 8, 3005);
    			option0.__value = "-12:00";
    			option0.value = option0.__value;
    			add_location(option0, file$4, 78, 12, 3262);
    			option1.__value = "-11:00";
    			option1.value = option1.__value;
    			add_location(option1, file$4, 79, 12, 3339);
    			option2.__value = "-10:00";
    			option2.value = option2.__value;
    			add_location(option2, file$4, 80, 12, 3417);
    			option3.__value = "-09:50";
    			option3.value = option3.__value;
    			add_location(option3, file$4, 81, 12, 3481);
    			option4.__value = "-09:00";
    			option4.value = option4.__value;
    			add_location(option4, file$4, 82, 12, 3545);
    			option5.__value = "-08:00";
    			option5.value = option5.__value;
    			add_location(option5, file$4, 83, 12, 3608);
    			option6.__value = "-07:00";
    			option6.value = option6.__value;
    			add_location(option6, file$4, 84, 12, 3695);
    			option7.__value = "-06:00";
    			option7.value = option7.__value;
    			add_location(option7, file$4, 85, 12, 3783);
    			option8.__value = "-05:00";
    			option8.value = option8.__value;
    			option8.selected = "selected";
    			add_location(option8, file$4, 86, 12, 3883);
    			option9.__value = "-04:50";
    			option9.value = option9.__value;
    			add_location(option9, file$4, 87, 12, 4004);
    			option10.__value = "-04:00";
    			option10.value = option10.__value;
    			add_location(option10, file$4, 88, 12, 4068);
    			option11.__value = "-03:50";
    			option11.value = option11.__value;
    			add_location(option11, file$4, 89, 12, 4164);
    			option12.__value = "-03:00";
    			option12.value = option12.__value;
    			add_location(option12, file$4, 90, 12, 4233);
    			option13.__value = "-02:00";
    			option13.value = option13.__value;
    			add_location(option13, file$4, 91, 12, 4322);
    			option14.__value = "-01:00";
    			option14.value = option14.__value;
    			add_location(option14, file$4, 92, 12, 4391);
    			option15.__value = "+00:00";
    			option15.value = option15.__value;
    			add_location(option15, file$4, 93, 12, 4474);
    			option16.__value = "+01:00";
    			option16.value = option16.__value;
    			add_location(option16, file$4, 94, 12, 4572);
    			option17.__value = "+02:00";
    			option17.value = option17.__value;
    			add_location(option17, file$4, 95, 12, 4664);
    			option18.__value = "+03:00";
    			option18.value = option18.__value;
    			add_location(option18, file$4, 96, 12, 4746);
    			option19.__value = "+03:50";
    			option19.value = option19.__value;
    			add_location(option19, file$4, 97, 12, 4842);
    			option20.__value = "+04:00";
    			option20.value = option20.__value;
    			add_location(option20, file$4, 98, 12, 4905);
    			option21.__value = "+04:50";
    			option21.value = option21.__value;
    			add_location(option21, file$4, 99, 12, 4994);
    			option22.__value = "+05:00";
    			option22.value = option22.__value;
    			add_location(option22, file$4, 100, 12, 5056);
    			option23.__value = "+05:50";
    			option23.value = option23.__value;
    			add_location(option23, file$4, 101, 12, 5155);
    			option24.__value = "+05:75";
    			option24.value = option24.__value;
    			add_location(option24, file$4, 102, 12, 5247);
    			option25.__value = "+06:00";
    			option25.value = option25.__value;
    			add_location(option25, file$4, 103, 12, 5322);
    			option26.__value = "+06:50";
    			option26.value = option26.__value;
    			add_location(option26, file$4, 104, 12, 5401);
    			option27.__value = "+07:00";
    			option27.value = option27.__value;
    			add_location(option27, file$4, 105, 12, 5474);
    			option28.__value = "+08:00";
    			option28.value = option28.__value;
    			add_location(option28, file$4, 106, 12, 5554);
    			option29.__value = "+08:75";
    			option29.value = option29.__value;
    			add_location(option29, file$4, 107, 12, 5647);
    			option30.__value = "+09:00";
    			option30.value = option30.__value;
    			add_location(option30, file$4, 108, 12, 5709);
    			option31.__value = "+09:50";
    			option31.value = option31.__value;
    			add_location(option31, file$4, 109, 12, 5803);
    			option32.__value = "+10:00";
    			option32.value = option32.__value;
    			add_location(option32, file$4, 110, 12, 5876);
    			option33.__value = "+10:50";
    			option33.value = option33.__value;
    			add_location(option33, file$4, 111, 12, 5970);
    			option34.__value = "+11:00";
    			option34.value = option34.__value;
    			add_location(option34, file$4, 112, 12, 6044);
    			option35.__value = "+11:50";
    			option35.value = option35.__value;
    			add_location(option35, file$4, 113, 12, 6141);
    			option36.__value = "+12:00";
    			option36.value = option36.__value;
    			add_location(option36, file$4, 114, 12, 6213);
    			option37.__value = "+12:75";
    			option37.value = option37.__value;
    			add_location(option37, file$4, 115, 12, 6308);
    			option38.__value = "+13:00";
    			option38.value = option38.__value;
    			add_location(option38, file$4, 116, 12, 6381);
    			option39.__value = "+14:00";
    			option39.value = option39.__value;
    			add_location(option39, file$4, 117, 12, 6454);
    			attr_dev(select, "name", "timezone_offset");
    			select.required = true;
    			attr_dev(select, "id", "timezone-offset");
    			attr_dev(select, "class", "span5");
    			if (/*timeZone*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[6].call(select));
    			add_location(select, file$4, 77, 8, 3152);
    			attr_dev(div5, "class", "form-element svelte-fu9j4h");
    			add_location(div5, file$4, 74, 4, 2970);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary btn-lg");
    			add_location(button, file$4, 120, 4, 6554);
    			attr_dev(form, "class", "svelte-fu9j4h");
    			toggle_class(form, "submitted", /*submitted*/ ctx[3]);
    			add_location(form, file$4, 65, 4, 2186);
    			add_location(main, file$4, 63, 0, 2145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, link0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, head, anchor);
    			append_dev(head, script);
    			append_dev(head, t1);
    			append_dev(head, link1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t4);
    			append_dev(main, form);
    			append_dev(form, div1);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(label0, h20);
    			append_dev(div1, t6);
    			append_dev(div1, input);
    			set_input_value(input, /*eventName*/ ctx[0]);
    			append_dev(form, t7);
    			append_dev(form, div3);
    			append_dev(div3, div2);
    			append_dev(div2, label1);
    			append_dev(label1, h21);
    			append_dev(div3, t9);
    			append_dev(div3, inclusive_dates);
    			append_dev(form, t10);
    			append_dev(form, div5);
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
    			select_option(select, /*timeZone*/ ctx[1]);
    			append_dev(form, t53);
    			append_dev(form, button);
    			append_dev(form, t55);
    			if (if_block) if_block.m(form, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[6]),
    					listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*eventName*/ 1 && input.value !== /*eventName*/ ctx[0]) {
    				set_input_value(input, /*eventName*/ ctx[0]);
    			}

    			if (dirty & /*timeZone*/ 2) {
    				select_option(select, /*timeZone*/ ctx[1]);
    			}

    			if (/*hasError*/ ctx[2] == true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(form, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*submitted*/ 8) {
    				toggle_class(form, "submitted", /*submitted*/ ctx[3]);
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
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
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

    const errMessage = "Please fill out all fields.";

    function instance$4($$self, $$props, $$invalidate) {
    	let $eventProperties;
    	let $storedData;
    	validate_store(eventProperties, 'eventProperties');
    	component_subscribe($$self, eventProperties, $$value => $$invalidate(9, $eventProperties = $$value));
    	validate_store(storedData, 'storedData');
    	component_subscribe($$self, storedData, $$value => $$invalidate(10, $storedData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NewEvent', slots, []);
    	let eventName = '';
    	let dateRange = '';
    	let timeZone = '-05:00';
    	let hasError = false;
    	let isSuccessVisible = false;
    	let submitted = false;

    	// const datepicker = jQuery('#date-range');
    	onMount(() => {
    		const datepicker = document.getElementById('date-range');
    		console.log(datepicker);

    		datepicker.addEventListener('selectDate', function (event) {
    			dateRange = event.detail;
    		});
    	});

    	function handleSubmit(e) {
    		console.log(eventName);
    		console.log(dateRange);
    		console.log(timeZone);

    		if (!eventName || !dateRange || dateRange.length == 0 || !timeZone) {
    			$$invalidate(2, hasError = true);
    		} else {
    			$$invalidate(2, hasError = false);

    			if (submitted) {
    				while (eventName in $storedData) {
    					$$invalidate(0, eventName = eventName + "-1");
    				}

    				currentEvent.set(eventName);
    				console.log("in handle submit");
    				eventProperties.set(Object.assign({}, { [eventName]: { timeZone, dateRange } }, $eventProperties));
    				location.href = "/" + eventName;
    			}
    		}
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<NewEvent> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		eventName = this.value;
    		$$invalidate(0, eventName);
    	}

    	function select_change_handler() {
    		timeZone = select_value(this);
    		$$invalidate(1, timeZone);
    	}

    	const click_handler = () => $$invalidate(3, submitted = true);

    	$$self.$capture_state = () => ({
    		storedData,
    		currentUser,
    		currentEvent,
    		eventProperties,
    		eventName,
    		dateRange,
    		timeZone,
    		fly,
    		fade,
    		jQuery,
    		onMount,
    		hasError,
    		isSuccessVisible,
    		submitted,
    		errMessage,
    		handleSubmit,
    		$eventProperties,
    		$storedData
    	});

    	$$self.$inject_state = $$props => {
    		if ('eventName' in $$props) $$invalidate(0, eventName = $$props.eventName);
    		if ('dateRange' in $$props) dateRange = $$props.dateRange;
    		if ('timeZone' in $$props) $$invalidate(1, timeZone = $$props.timeZone);
    		if ('hasError' in $$props) $$invalidate(2, hasError = $$props.hasError);
    		if ('isSuccessVisible' in $$props) isSuccessVisible = $$props.isSuccessVisible;
    		if ('submitted' in $$props) $$invalidate(3, submitted = $$props.submitted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		eventName,
    		timeZone,
    		hasError,
    		submitted,
    		handleSubmit,
    		input_input_handler,
    		select_change_handler,
    		click_handler
    	];
    }

    class NewEvent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewEvent",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/ExistingEvent.svelte generated by Svelte v3.55.1 */
    const file$3 = "src/components/ExistingEvent.svelte";

    function create_fragment$3(ctx) {
    	let link0;
    	let t0;
    	let head;
    	let script;
    	let script_src_value;
    	let t1;
    	let link1;
    	let t2;
    	let div2;
    	let div1;
    	let div0;
    	let label;
    	let h3;
    	let t4;
    	let br0;
    	let t5;
    	let input;
    	let t6;
    	let br1;
    	let t7;
    	let br2;
    	let t8;
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
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			label = element("label");
    			h3 = element("h3");
    			h3.textContent = "Enter Existing Event Code";
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			input = element("input");
    			t6 = space();
    			br1 = element("br");
    			t7 = space();
    			br2 = element("br");
    			t8 = space();
    			button = element("button");
    			button.textContent = "Enter Event";
    			attr_dev(link0, "href", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css");
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "integrity", "sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ");
    			attr_dev(link0, "crossorigin", "anonymous");
    			add_location(link0, file$3, 1, 1, 15);
    			attr_dev(script, "type", "module");
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/esm/inclusive-dates.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$3, 18, 2, 744);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/themes/light.css");
    			add_location(link1, file$3, 24, 2, 903);
    			add_location(head, file$3, 17, 0, 735);
    			add_location(h3, file$3, 33, 30, 1126);
    			attr_dev(label, "for", "event-code");
    			add_location(label, file$3, 33, 6, 1102);
    			add_location(br0, file$3, 34, 6, 1175);
    			attr_dev(input, "id", "event-code");
    			add_location(input, file$3, 36, 6, 1236);
    			add_location(br1, file$3, 37, 6, 1289);
    			add_location(br2, file$3, 38, 6, 1300);
    			attr_dev(div0, "class", "existing-event");
    			attr_dev(div0, "role", "region");
    			add_location(div0, file$3, 32, 4, 1053);
    			attr_dev(div1, "class", "cf");
    			add_location(div1, file$3, 31, 4, 1032);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary btn-lg");
    			add_location(button, file$3, 43, 4, 1416);
    			add_location(div2, file$3, 30, 0, 1022);
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
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(label, h3);
    			append_dev(div0, t4);
    			append_dev(div0, br0);
    			append_dev(div0, t5);
    			append_dev(div0, input);
    			set_input_value(input, /*eventcode*/ ctx[0]);
    			append_dev(div0, t6);
    			append_dev(div0, br1);
    			append_dev(div0, t7);
    			append_dev(div0, br2);
    			append_dev(div2, t8);
    			append_dev(div2, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(button, "click", /*onClick*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*eventcode*/ 1 && input.value !== /*eventcode*/ ctx[0]) {
    				set_input_value(input, /*eventcode*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(head);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('ExistingEvent', slots, []);
    	let eventcode = '';
    	let hasErr = false;

    	// concept: sharing mechanism
    	// actions: enter event, ensure uniqueness of event code
    	function onClick() {
    		location.href = "/" + eventcode;
    	}
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExistingEvent> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		eventcode = this.value;
    		$$invalidate(0, eventcode);
    	}

    	$$self.$capture_state = () => ({
    		storedData,
    		currentUser,
    		currentEvent,
    		eventcode,
    		hasErr,
    		onClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('eventcode' in $$props) $$invalidate(0, eventcode = $$props.eventcode);
    		if ('hasErr' in $$props) hasErr = $$props.hasErr;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [eventcode, onClick, input_input_handler];
    }

    class ExistingEvent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExistingEvent",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/HomePage.svelte generated by Svelte v3.55.1 */
    const file$2 = "src/components/HomePage.svelte";

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
    	let h1;
    	let t4;
    	let h3;
    	let t6;
    	let br0;
    	let br1;
    	let br2;
    	let t7;
    	let a;
    	let t9;
    	let br3;
    	let br4;
    	let br5;
    	let br6;
    	let t10;
    	let existingevent;
    	let current;
    	existingevent = new ExistingEvent({ $$inline: true });

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
    			h1.textContent = "When2Speech";
    			t4 = space();
    			h3 = element("h3");
    			h3.textContent = "A speech and text based way to find times to meet with others.";
    			t6 = space();
    			br0 = element("br");
    			br1 = element("br");
    			br2 = element("br");
    			t7 = space();
    			a = element("a");
    			a.textContent = "Create New Event";
    			t9 = space();
    			br3 = element("br");
    			br4 = element("br");
    			br5 = element("br");
    			br6 = element("br");
    			t10 = space();
    			create_component(existingevent.$$.fragment);
    			attr_dev(link0, "href", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css");
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "integrity", "sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ");
    			attr_dev(link0, "crossorigin", "anonymous");
    			add_location(link0, file$2, 1, 1, 15);
    			attr_dev(script, "type", "module");
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/esm/inclusive-dates.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$2, 7, 2, 514);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "https://cdn.jsdelivr.net/npm/inclusive-dates/dist/themes/light.css");
    			add_location(link1, file$2, 13, 2, 673);
    			add_location(head, file$2, 6, 0, 505);
    			add_location(h1, file$2, 20, 4, 803);
    			add_location(h3, file$2, 21, 4, 828);
    			add_location(br0, file$2, 22, 4, 904);
    			add_location(br1, file$2, 22, 8, 908);
    			add_location(br2, file$2, 22, 12, 912);
    			attr_dev(a, "href", "/new");
    			attr_dev(a, "class", "btn btn-primary btn-lg svelte-1wdb332");
    			add_location(a, file$2, 23, 4, 921);
    			add_location(br3, file$2, 24, 4, 992);
    			add_location(br4, file$2, 24, 8, 996);
    			add_location(br5, file$2, 24, 12, 1000);
    			add_location(br6, file$2, 24, 16, 1004);
    			add_location(main, file$2, 19, 0, 792);
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
    			append_dev(main, h3);
    			append_dev(main, t6);
    			append_dev(main, br0);
    			append_dev(main, br1);
    			append_dev(main, br2);
    			append_dev(main, t7);
    			append_dev(main, a);
    			append_dev(main, t9);
    			append_dev(main, br3);
    			append_dev(main, br4);
    			append_dev(main, br5);
    			append_dev(main, br6);
    			append_dev(main, t10);
    			mount_component(existingevent, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(existingevent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(existingevent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(head);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(main);
    			destroy_component(existingevent);
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
    	validate_slots('HomePage', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HomePage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ExistingEvent });
    	return [];
    }

    class HomePage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomePage",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/routes/index.svelte generated by Svelte v3.55.1 */
    const file$1 = "src/routes/index.svelte";

    // (19:4) <Route path="/:id" let:params>
    function create_default_slot_1(ctx) {
    	let inputtimes;
    	let current;

    	inputtimes = new InputTimes({
    			props: { eventID: /*params*/ ctx[1].id },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(inputtimes.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputtimes, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputtimes_changes = {};
    			if (dirty & /*params*/ 2) inputtimes_changes.eventID = /*params*/ ctx[1].id;
    			inputtimes.$set(inputtimes_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputtimes.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputtimes.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputtimes, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(19:4) <Route path=\\\"/:id\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (13:0) <Router {url}>
    function create_default_slot(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let current;

    	route0 = new Route({
    			props: { path: "/new", component: NewEvent },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: { path: "/", component: HomePage },
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/:id",
    				$$slots: {
    					default: [
    						create_default_slot_1,
    						({ params }) => ({ 1: params }),
    						({ params }) => params ? 2 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
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
    			add_location(div, file$1, 13, 2, 351);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t0);
    			mount_component(route1, div, null);
    			append_dev(div, t1);
    			mount_component(route2, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route2_changes = {};

    			if (dirty & /*$$scope, params*/ 6) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
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

    			if (dirty & /*$$scope*/ 4) {
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
