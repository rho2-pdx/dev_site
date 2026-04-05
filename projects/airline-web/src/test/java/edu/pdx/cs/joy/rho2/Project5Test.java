package edu.pdx.cs.joy.rho2;

import org.junit.jupiter.api.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
/**
 * User-friendly error messages for below scenarios:
 * - command line input missing, or extraneous included
 * - day/time format is incorrect (specify which part)
 * - text file malformatted
 * - airline name doesn't match one in text file
 * (only one airline in text file for this project)
 */


/**
 * A unit test for code in the <code>Project4</code> class.  This is different
 * from <code>Project4IT</code> which is an integration test (and can capture data
 * written to {@link System#out} and the like.
 */
class Project5Test {

  @Test
  void readmeCanBeReadAsResource() throws IOException {
    try (
        InputStream readme = Project5.class.getResourceAsStream("README.txt")
    ) {
      assertThat(readme, not(nullValue()));
      BufferedReader reader = new BufferedReader(new InputStreamReader(readme));
      String line = reader.readLine();
      assertThat(line, containsString("This is a readme"));
    }
  }

  @Test
  void checkForREADME() {
    Project5.main(new String[]{"-README"});
  }

  @Test
  void checkWithFullInput() {
    Project5.main(new String[]{"-textFile", "textfile.txt",
        "alaska air", "123", "PDX", "1/27/2025", "12:00", "AM",
        "LAX", "1/27/2025", "5:00", "AM"
    });

  }

}
