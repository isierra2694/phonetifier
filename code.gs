function onInstall() {
  onOpen();
}

function onOpen() {
  DocumentApp.getUi()
  .createAddonMenu()
  .addItem("Phonetifier", "showSidebar")
  .addToUi();
}

function showSidebar() {
  var html = HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("Phonetifier");
  DocumentApp.getUi().showSidebar(html);
}

// Called when we press the start button on HTML
function startUnderlining(terms) {
  for(var i=0; i<terms.length; i++) {
    underlineTerm(terms[i]);
  }
}

function underlineTerm(term) {
  var doc = DocumentApp.getActiveDocument();
  var bodyElement = DocumentApp.getActiveDocument().getBody();
  var searchResult = bodyElement.findText(term);

  while (searchResult !== null) {
    var thisElement = searchResult.getElement();
    var thisElementText = thisElement.asText();

    thisElementText.setUnderline(searchResult.getStartOffset(), searchResult.getEndOffsetInclusive(), true);

    searchResult = bodyElement.findText(term, searchResult);
  }
}

function highlightVowels() {
  var background = "#F3E2A9";
  var vowels = ['a', 'e', 'i', 'o', 'u'];
  var doc = DocumentApp.getActiveDocument();
  var bodyElement = DocumentApp.getActiveDocument().getBody();

  for (var i=0; i<vowels.length; i++) {
    searchResult = bodyElement.findText(vowels[i]);

    while (searchResult !== null) {
      var thisElement = searchResult.getElement();
      var thisElementText = thisElement.asText();

      thisElementText.setBackgroundColor(searchResult.getStartOffset(), searchResult.getEndOffsetInclusive(),background);

      searchResult = bodyElement.findText(vowels[i], searchResult);
    }
  }
}

function onTermsListChanged(_termsList) {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties(_termsList);
  Logger.log("Saved " + scriptProperties);
}

function getSavedTermsList() {
  return PropertiesService.getScriptProperties();
}
