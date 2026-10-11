# Add a case study

Case studies are published from `src/data/projects.ts`. Each item should contain verified, approved information; the production build rejects incomplete published records.

## Required source material

Before drafting, confirm:

- The client or approved anonymized name may be published.
- The client approved the summary, project images, brand marks, and any quoted results.
- The problem, SinTech’s contribution, shipped solution, and technology list are accurate.
- Every metric has a source, measurement window, and permission to publish.
- Any person shown in a photo has approved its publication.

Do not infer a client, result, technology, award, performance gain, or timeline. If a result cannot be substantiated, omit it.

## Content structure

Use the fields in the `Project` type:

- `slug`: lowercase URL-safe words separated by hyphens.
- `title`: a specific, approved title.
- `published`: keep `false` until the content and permissions are approved.
- `service`: the relevant service area.
- `summary`: a concise, factual description.
- `problem`: the client problem or agreed objective.
- `approach`: what SinTech actually did.
- `solution`: what was delivered.
- `stack`: only technologies confirmed in the project record.
- `cover`: optional, approved image path. Keep the source image and provide useful alternative text in the page if the image is meaningful.

Keep the existing structure unless a real case study needs another field. Any newly added field should have a clear source and should not imply unverified proof.

## Publish and verify

1. Add the record in `src/data/projects.ts` with `published: false`.
2. Review the full text and all assets with the client or authorized owner.
3. Set `published: true` only after approval.
4. Run `pnpm run check`. The build will generate the route, metadata, structured data, and discovery links from the published record.
5. Open the generated route and check the desktop and mobile layouts before release.
