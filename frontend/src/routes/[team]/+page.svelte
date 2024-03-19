<script lang="ts">
    import Card from '$lib/Card.svelte';
    import Glow from '$lib/Glow.svelte';
import type { PageData } from './$types';
    
    export let data: PageData;

    console.log(data.team)
</script>

<main class="flex flex-col sm:flex-row p-4 sm:p-10 pt-20 gap-6 h-full">
    <section class="flex sm:sticky items-center sm:min-w-72 sm:max-w-72 md:min-w-96 md:max-w-96 max-h-screen h-full top-0">
        <div class="relative sm:sticky sm:top-20 sm:min-w-72 sm:max-w-72 md:min-w-96 md:max-w-96">
            <Card>
                <div class="">
                    <h1 class="text-2xl font-semibold p-1">{ data.team }</h1>
                </div>
                <p class="p-1 text-justify text-slate-700 dark:text-slate-300">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum quis eligendi cupiditate aspernatur? Voluptatum quas aliquid commodi tempore explicabo accusantium!
                </p>
                <a href="?request" class="block mt-2 m-0.5 bg-violet-600 text-slate-100 px-3 py-1.5 rounded-md font-medium w-fit">Start request</a>
            </Card>
        </div>
    </section>
    <section class="grow p-4 self-center">
        <h2 class="text-2xl sm:mt-4 font-semibold">Details</h2>
        <p class="text-slate-700 dark:text-slate-300 text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo architecto dolor temporibus nobis obcaecati vitae magnam expedita magni nisi impedit quaerat pariatur ipsum sit dicta, aperiam repellat consequatur laudantium aliquam.
            Sapiente sunt quisquam molestiae recusandae sint veniam nemo at quibusdam nobis. Ipsa placeat maiores amet, velit non doloribus eum voluptatem reiciendis dicta.
            <br/>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae sapiente, eius dolorem labore ullam beatae accusantium non, doloribus, reiciendis obcaecati aliquam quibusdam sunt perspiciatis aliquid voluptatibus quis fugiat. Saepe, cum?
            Molestias earum voluptate repellat cumque mollitia dignissimos, laudantium distinctio veniam repellendus quaerat ex rem nulla deserunt esse? Laudantium dolorum quibusdam quia enim!
        </p>
    </section>
</main>

<svelte:head>
    <title>{ data.team } | Entangler</title>
</svelte:head>