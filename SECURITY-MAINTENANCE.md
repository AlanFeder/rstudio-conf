# Archived presentation security

The two checked-in Reveal.js copies are prebuilt presentation assets. Their
unused Grunt build environments and Node/Socket.IO multiplex/notes servers
have been removed together with the old package manifests. The decks do not
reference those server plugins; local slide navigation and browser speaker
notes assets are retained. Do not use the archive as a Node application.

The bundled Reveal message handlers now reject cross-origin and opaque-origin
messages before dispatching any API call. Tests verify that unrelated windows
cannot invoke the slide API while same-origin navigation still works.

Run `node --test tools/security.test.mjs` to verify both copies. This maintenance
change preserves the compiled slides; it is not a full audit or regeneration
of every historical vendored JavaScript library in the conference archive.
