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

function showTermsDialog() {
  var html = HtmlService.createHtmlOutputFromFile("termsdialog")
    .setWidth(300)
    .setHeight(700);
  DocumentApp.getUi()
    .showModalDialog(html, "Edit terms");
}

function showSettingsDialog() {
  var html = HtmlService.createHtmlOutputFromFile("settingsdialog")
    .setWidth(300)
    .setHeight(300);
  DocumentApp.getUi()
    .showModalDialog(html, "Settings")
}

// Called when we press the start button on HTML
function startUnderlining() {
  var termsList = getSavedTermsList();
  for (const [key, value] of Object.entries(termsList)) {
    // Value is an array [activeState, term], we need value[1] for term
    underlineTerm(value[1]);
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

function onTermsListChanged(termsList) {
  var newDictionary = {};
  for (var key in termsList) {
    var value = termsList[key];
    var jvalue = JSON.stringify(value);
    newDictionary[key] = jvalue;
  }

  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties(newDictionary);
  Logger.log("Saved termslist");
}

function getSavedTermsList() {
  var actual = {};
  var properties = PropertiesService.getScriptProperties();
  var data = properties.getProperties();

  for (var key in data) {
    var value = data[key];
    var pvalue = JSON.parse(value);
    actual[key] = pvalue;
  }

  return actual;
}

function clearTermsList() {
  var properties = PropertiesService.getScriptProperties();
  properties.deleteAllProperties();
  Logger.log("Cleared property store");
}
