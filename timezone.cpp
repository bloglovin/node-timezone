#include "timezone.hpp"
#include <time.h>
#include <cstring>
#include <stdlib.h>
#include <iostream>

using namespace v8;
using namespace node;
using namespace std;

Handle<Value> GetUTCTime(const Arguments& args) {
    HandleScope scope;

    // Get the utf8-values for the string representations of our arguments.
    String::Utf8Value isoDateTimeUTF8(args[0]->ToString());
    String::Utf8Value timezoneNameUTF8(args[1]->ToString());

    // Get c strings for the iso datetime & timezones
    const char *isoDateTime = *isoDateTimeUTF8;
    const char *timezoneName = *timezoneNameUTF8;
    const char *originalTz = getenv("TZ");

    // Calculate the required size for the timezone putenv buffer.
    size_t tzBufferSize = max(strlen(timezoneName), originalTz ? strlen(originalTz) : 0) + 4;
    char tzBuffer [tzBufferSize];

    // Change timezone
    snprintf(tzBuffer, tzBufferSize, "TZ=%s", timezoneName);
    putenv(tzBuffer);
    tzset();

    // Get a local time info struct that we can manipulate.
    time_t timestamp = time(NULL);
    tm timeInfo = *localtime(&timestamp);

    // Scan the input isoDateTime and store the result in our time struct.
    int result = sscanf(isoDateTime, "%d-%d-%dT%d:%d:%d",
      &timeInfo.tm_year, &timeInfo.tm_mon, &timeInfo.tm_mday,
      &timeInfo.tm_hour, &timeInfo.tm_min, &timeInfo.tm_sec);

    time_t localTimeInGMT;
    // If we scanned six values the datetime was valid.
    if (result == 6) {
      // Offset year & month to take the starting-values of std:tm.
      timeInfo.tm_year -= 1900;
      timeInfo.tm_mon -= 1;
      // Get mktime to re-guess the DST.
      timeInfo.tm_isdst = -1;

      // Get the timestamp from local time.
      localTimeInGMT = mktime(&timeInfo);
    }

    // Restore tz.
    snprintf(tzBuffer, tzBufferSize, "TZ=%s", originalTz);
    putenv(tzBuffer);
    tzset();

    // If we didn't scan six values the datetime wasn't valid.
    if (result < 6) {
      return ThrowException(Exception::Error(
                  String::New("Not a valid ISO date time")));
    }

    // Return a v8 number with the timestamp.
    return scope.Close(Number::New(localTimeInGMT));
}

void RegisterModule(Handle<Object> target) {
    target->Set(String::NewSymbol("getUTCTime"),
        FunctionTemplate::New(GetUTCTime)->GetFunction());
}

NODE_MODULE(timezone, RegisterModule);
