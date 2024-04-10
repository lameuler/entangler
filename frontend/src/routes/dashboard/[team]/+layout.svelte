<script lang="ts">
    import { goto } from '$app/navigation';
    import { crumbs } from '../crumb';
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;

    data.teamPromise.then(team => {
        if (team.role < 2) { // redirect to public page if not manager or owner
            goto('/'+team.t_id, { replaceState: true })
        }
        $crumbs = [{ name: team.name, path: '/dashboard/'+team.t_id }]
    })
</script>

<slot/>