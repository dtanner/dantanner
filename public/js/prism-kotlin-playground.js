function addKotlinPlaygroundLink() {
  if (typeof Prism === 'undefined') {
    console.error('Prism is not loaded');
    return;
  } else {
    console.debug('Prism is loaded');
  }

  Prism.hooks.add('after-highlight', function (env) {
    console.debug('Prism hook called');
    if (env.element.classList.contains('language-kotlin')) {
      // Get the code content
      var code = env.element.textContent;

      // Encode the code for the URL
      var encodedCode = encodeURIComponent(code);

      console.debug('code:', code);
      console.debug('Encoded code:', encodedCode);

      // Create the Kotlin Playground URL
      var playgroundUrl = 'https://play.kotlinlang.org/#code=' + encodedCode;

      // Create the "Run in Kotlin Playground" link
      var runLink = document.createElement('a');
      runLink.textContent = 'Run in Kotlin Playground';
      runLink.href = playgroundUrl;
      runLink.target = '_blank';
      runLink.className = 'kotlin-playground-link';

      // Add some basic styling to the link
      runLink.style.display = 'inline-block';
      runLink.style.marginTop = '10px';
      runLink.style.padding = '5px 10px';
      runLink.style.backgroundColor = '#7F52FF';
      runLink.style.color = 'white';
      runLink.style.textDecoration = 'none';
      runLink.style.borderRadius = '4px';

      // Insert the link after the code block
      env.element.parentNode.insertBefore(runLink, env.element.nextSibling);
    }
  });

  Prism.highlightAll();
}
