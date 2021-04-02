
    let selection = document.querySelector('Select')
    let result = document.querySelector('h2')

    selection.addEventListener('change', () => {
      result.innerText = selection.options[selection.selectedIndex].text
    })