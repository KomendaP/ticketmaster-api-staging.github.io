package bla.tm.definitions.site;

import bla.tm.steps.AnyPageSteps;
import bla.tm.steps.HomePageSteps;
import bla.tm.steps.pantheon.UserLogInSteps;
import net.thucydides.core.annotations.Steps;
import org.jbehave.core.annotations.Given;
import org.jbehave.core.annotations.Then;
import org.jbehave.core.annotations.When;

import static bla.tm.DevSiteTestsRunner.baseTestedUrl;
import static org.junit.Assert.assertTrue;

public class HomePageDefinition {

    @Steps
    HomePageSteps homePage;

    @Steps
    AnyPageSteps anyPage;

    @Steps
    UserLogInSteps userLogInPage;

    @Given("open Home page")
    public void openHomePage() {
        homePage.openPage();
    }

    @When("check visibility and click $key element of Home page")
    public void clickGetAPIKeyButton(String key) {
        homePage.validateAndClickElement(key);
    }

    @When("navigate to Pantheon LogIn page from Home page")
    public void openLogInPageAndCheckUserIsNotLoggedIn() {
        homePage.clickLogIn();
        userLogInPage.isPageOpened();
    }

    @Then("check that new page opened from Home page has $url and $xpath")
    public void checkIfPageIsOpened(String url, String xpath){
        anyPage.checkIfPageIsOpened(url,xpath,baseTestedUrl);
    }

    @Then("check general page elements for Home Page, where DISQUS = $disqus and LeftMenu = $leftMenu")
    public void checkGeneralPageElements(boolean disqus, boolean leftMenu){
        homePage.checkIfTitleIsCorrect();
        homePage.checkGeneralPageElements(disqus, leftMenu);
    }

    @Then("check that Twitter's list of events is shown")
    public void checkTwittersList() {
        assertTrue(homePage.isDisplayedTwittersList());
    }

    @Then("Summary widget is shown for Home page")
    public void checkSummaryWidgetVisible(){
        homePage.checkSummaryWidgetVisible();
    }

}
