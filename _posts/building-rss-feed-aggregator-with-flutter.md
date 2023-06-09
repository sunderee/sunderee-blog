---
title: "Building RSS Feed Aggregator With Flutter"
description: "RSS should make a comeback, why did I develop my app and what can you learn from it"
category: Flutter
author: "Peter Aleksander Bizjak"
date: "2023-06-09 15:26"
---

In an era of digital information overload, finding a simple, reliable, and unintrusive tool to aggregate the news that matters to you most can be a daunting challenge. Many of us have grown weary of the mainstream platforms that curate our newsfeeds, often inaccurately predicting our interests, and necessitating a constant tug-of-war with algorithms. Additionally, these platforms require account creation, leading to privacy concerns and a bloated experience. I found myself in this very predicament, yearning for a straightforward, user-friendly tool that would allow me to handpick my news sources without any unnecessary features or unwelcome interference.

Moreover, as a privacy-conscious individual, the question of who was behind the apps I used and what they might do with my data was constantly on my mind. And to be honest, the user interfaces of many existing RSS feed aggregator apps left a lot to be desired. So, I decided to take matters into my own hands. Why not build a simple, elegant, and trustworthy RSS Feed Aggregator with Flutter?

[This app](https://github.com/sunderee/yrss) was created with the objective of simplicity and user control at its core. Upon opening it, you are greeted with a minimalist interface where you can input the URL of a desired RSS feed, which is then added to your list. From there, you can browse through the aggregated news, open individual items, and either read the description or load the full article via an in-app WebView.

Designed with an offline-first approach, you can always access your news, even without an active internet connection, ensuring you are never out of touch with your favorite sources. The first version is built using Google's Material 3 theme, adhering strictly to the principles of Material Design, without any custom widgets. Initially, the app is available for iOS users, but plans are already in motion to bring it to Android, as well as to introduce new features such as bookmarking, feed list rearranging, folder creation, and routine bug fixes.

Let's dive into it then!

## About RSS

RSS, short for Really Simple Syndication, is a web feed format that allows users and applications to access updates to online content in a standardized, computer-readable format. These feeds can be read using software called an "RSS reader", "feed reader", or "aggregator". RSS feeds are an easy and automated way for users to receive new content from multiple sources, in a unified and easy-to-access format, without having to manually check each website.

RSS feeds use a standardized XML (eXtensible Markup Language) file format. But why XML over other data formats, like JSON (JavaScript Object Notation)? The answer lies in the historical context and the fundamental differences between the two data formats. RSS was conceived in the late 1990s and early 2000s, a time when XML was the de facto standard for data interchange, well before JSON gained its popularity.

XML was designed to store and transport data, with a focus on what data is. It uses a markup language to define custom tags that facilitate the description, transmission, and interpretation of data. In contrast, JSON, which came into prominence later, is a data-interchange format that focuses on how data is structured, offering a more compact and easy-to-parse format.

When RSS was being developed, XML was the natural choice due to its wide adoption and its ability to describe complex data structures in a way that was both human- and machine-readable. Despite JSON's later rise in popularity due to its simplicity and compactness, the shift in the standard format for RSS feeds would have required a significant overhaul of existing systems and thus has not occurred.

There are alternatives to RSS for content syndication, each with its unique strengths. Atom, for example, is a popular alternative that also uses XML and offers more advanced features like content summarization and categorization. However, it's more complex to implement than RSS.

Another alternative is JSON Feed, a newer format that uses JSON instead of XML. It offers the advantages of JSON, such as a more compact format and easier parsing, but it's not as widely adopted as RSS or Atom.

## About the App

The decision to use Flutter as the development platform was a straightforward one, given my extensive experience as a professional Flutter developer over the past three years. During this time, I have come to appreciate the numerous benefits the platform offers, particularly in terms of codebase size and developer experience.

1. The size of the codebase for the RSS Feed Aggregator is a testament to Flutter's efficiency. As it stands, the entire codebase comprises fewer than 3,000 lines of code. This conciseness leads to easier maintainability, quicker debugging, and overall a more manageable project.

2. The developer experience that Flutter offers is second to none. The robustness and simplicity of the platform allowed me to build the business logic for the RSS Feed Aggregator in just an afternoon. Within a single weekend, I had a working MVP. This rapid development cycle is a testament to the ease of use and efficiency that Flutter provides.

When it came to choosing the initial platform, I opted for iOS first because my device is an iPhone. This personal access facilitated a more intimate testing and debugging process, allowing me to understand the user experience firsthand, and in turn, refine the app's functionality and design.

As for the programming language, I decided to utilize all the latest features of Dart 3. This decision is rooted in my firm belief that the only way to build good software is to embrace progress and live on the slightly riskier side of things. Staying up-to-date with the latest developments allows us to harness the power and efficiencies they offer, leading to a more robust and efficient application.

Looking ahead, I plan to migrate from the stable branch to the master branch by the time this article is published. This transition is in line with my approach to embracing progress and will enable me to stay on the cutting edge, taking advantage of the latest improvements and updates to Flutter, thus enhancing the app's features and overall performance.

## Let's Get Technical

Let’s check out some code, boys!

### Architecture

Choosing the right tools and architecture plays a crucial role in the success of an application, and our RSS Feed Aggregator app is no exception. This article will delve into the architectural decisions and technical considerations that shaped the app's development.

At the heart of the app's state management, we find BLoC - Business Logic Component. BLoC offers a clear and systematic way to manage data flow within the app, promoting a clean separation between the business logic and the presentation layer. This separation facilitates a cleaner and more maintainable codebase.

```dart
typedef FeedState = ({
  bool hasData,
  List<FeedObjectSchema>? data,
  Object? exception,
});

final class FeedCubit extends Cubit<FeedState> with BlocLoggy {
  FeedCubit(
    super.initialState, {
    required this.service,
  }) {
    service.sourceStream.forEach((final resource) {
      loggy.info(resource.toString());

      (switch (resource.status) {
        ResourceStatus.empty || ResourceStatus.loading => emit((
            hasData: false,
            data: null,
            exception: null,
          )),
        ResourceStatus.success => emit((
            hasData: true,
            data: resource.data,
            exception: null,
          )),
        ResourceStatus.failed => emit((
            hasData: false,
            data: null,
            exception: resource.exception,
          ))
      });
    });
  }

  final IRssService service;

  final _addSourceController = StreamController<AddSourceResult>.broadcast();
  Stream<AddSourceResult> get addSourceStream => _addSourceController.stream;

  @override
  Future<void> close() {
    _addSourceController.close();
    return super.close();
  }

  void loadData() {
    loggy.info('Loading RSS feed data...');
    service.readSources();
  }

  Future<void> addFeedURL(final String url) async {
    loggy.info('Attempting to add source $url and reload feeds...');

    final addSourceResult = await service.addSource(url);
    loggy.info('...add source result: $addSourceResult');
    _addSourceController.add(addSourceResult);

    if (addSourceResult == AddSourceResult.success) {
      loggy.info('...reloading feeds');
      loadData();
    }
  }

  Future<void> removeFeedURL(final String url) async {
    loggy.info('Remove feed by URL: $url...');
    await service.removeSource(url);
    loadData();
  }
}
```

You might be wondering why I didn't use a dependency injection library for the project. The answer is simplicity. Given the app's straightforward nature, introducing an additional layer of complexity for dependency management would be unnecessary and could lead to complications. By keeping things simple, we maintain a lightweight, manageable codebase.

The application makes use of a custom implementation of the Network-Bound Resource (NBR) algorithm. NBR is a strategic pattern that helps decide whether to fetch data from the network or use locally stored data. By checking the database for up-to-date data before making network requests, NBR ensures efficient resource use and a seamless user experience.

To manage data storage, the app employs a combination of shared preferences and the Isar database. Shared preferences, a basic key-value store, hold the "sources" - the list of URLs to RSS feeds. In contrast, Isar, a high-performance, cross-platform database, enables the app's offline-first functionality. It stores the fetched RSS feed items, so users can access their news even without an internet connection.

While the app currently operates only in English, it's been set up for potential translations using the `intl` package. This preparation allows for easy translation into other languages in the future, possibly even by the user community itself.

The app's design philosophy embraces the bare minimum, cutting out unnecessary libraries. This approach minimizes the complexity introduced with each library and keeps the app lightweight and easy to maintain. With that being said, despite BLoC's benefits, I'm exploring even lighter solutions. These built-in Flutter solutions offer simple yet powerful state management capabilities and could prove to be a more efficient alternative for our needs.

The principle of "program with interfaces, not implementations" guides the app's architecture. By setting up a solid foundation from the beginning, we're future-proofing our app, preparing it for potential growth and new features. This approach also enhances testability and maintainability.

Lastly, I've opted for the strictest possible type of checks. While it might seem counterintuitive, this approach is a productivity booster. By catching potential bugs and errors early on, we save debugging time and promote good coding practices, leading to a more robust and reliable application.

### NBR

The entire implementation revolves around the `NetworkBoundResource` abstract class and the `Resource` class. This implementation is also available as a [package on `pub.dev`](https://pub.dev/packages/nbr).

#### `Resource` Class

```dart
/// Enum representing different states in which a resource can be in.
enum ResourceStatus { empty, loading, success, failed }

/// Immutable class representing a resource that can be in one of four states:
/// `empty`, `loading`, `success`, or `failed`. It is designed to help manage
/// and represent the state of a resource in a clean and consistent way.
@immutable
final class Resource<T> extends Equatable {
  /// The status of the resource.
  final ResourceStatus status;

  /// The data associated with the resource, if it is in the success state.
  /// It will be `null` if the resource is in any state other than success.
  final T? data;

  /// The exception associated with the resource, if it is in the failed state.
  /// It will be `null` if the resource is in any state other than failed.
  final Object? exception;

  // Private constructor used by named constructors.
  const Resource._({
    required this.status,
    this.data,
    this.exception,
  });

  /// Named constructor for creating an empty resource.
  const Resource.empty() : this._(status: ResourceStatus.empty);

  /// Named constructor for creating a loading resource. Takes the nullable
  /// [data] which may or may not be associated with the resource
  const Resource.loading([T? data])
      : this._(
          status: ResourceStatus.loading,
          data: data,
        );

  /// Named constructor for creating a success resource. Takes the [data]
  /// associated with the resource.
  const Resource.success(T data)
      : this._(
          status: ResourceStatus.success,
          data: data,
        );

  /// Named constructor for creating a failed resource. Takes the [exception]
  /// associated with the resource.
  const Resource.failed(Object exception)
      : this._(
          status: ResourceStatus.failed,
          exception: exception,
        );

  @override
  List<Object?> get props => [status, data, exception];
}
```

The `Resource` class is an immutable class representing a resource that can be in one of four states: `empty`, `loading`, `success`, or `failed`. This class is designed to help manage and represent the state of a resource in a clean and consistent way.

- `status` indicates the current state of the resource.
- `data` holds the data associated with the resource if the resource is in the success state. Otherwise, it's `null`.
- `exception` captures any exception that occurred during the fetch operation if the resource is in the failed state. Otherwise, it's `null`.

There are four named constructors corresponding to the four states a resource can be in.

#### `NetworkBoundResource` Class

```dart
/// Abstract class representing a resource that is bound to a network request.
/// It uses a [StreamController] to emit a stream of [Resource] objects,
/// representing the current state of the resource (`loading`, `success`,
/// `failed`, or `empty`).
abstract class NetworkBoundResource<Entity> {
  StreamController<Resource<Entity>>? _controller;
  Stream<Resource<Entity>>? _stream;

  /// Getter for the stream of Resource objects.
  Stream<Resource<Entity>> get stream {
    _ensureControllerCreated();
    return _stream!;
  }

  /// Method to fetch the resource from the network and emit [Resource] objects
  /// representing the current state of the resource.
  ///
  /// This method takes several callbacks as arguments, which are used to fetch
  /// the resource from the API, load it from the database, store it to the
  /// database, determine if it should be fetched from the API, and map it from
  /// a DTO to an entity.
  Future<void> fetch<DTO>({
    required FetchFromApiCallback<DTO> fetchFromAPI,
    required LoadFromDBCallback<Entity> loadFromDB,
    required StoreToDBCallback<Entity> storeToDB,
    required ShouldFetchCallback<Entity> shouldFetch,
    required MapDTOToEntity<DTO, Entity> mapDTOToEntity,
  }) async {
    _controller?.add(Resource<Entity>.loading());
    final data = await loadFromDB();

    if (await shouldFetch(data)) {
      _controller?.add(Resource<Entity>.loading(data));
      try {
        final dto = await fetchFromAPI();
        final entity = mapDTOToEntity(dto);

        await storeToDB(entity);

        _controller?.add(Resource<Entity>.success(entity));
      } catch (exception) {
        _controller?.add(Resource<Entity>.failed(exception));
      }
    } else {
      if (data != null) {
        _controller?.add(Resource<Entity>.success(data));
      } else {
        _controller?.add(Resource<Entity>.empty());
      }
    }
  }

  void _ensureControllerCreated() {
    if (_controller == null) {
      _controller = StreamController<Resource<Entity>>.broadcast();
      _stream = _controller?.stream.asBroadcastStream();
    }
  }

  /// Method to dispose of the [NetworkBoundResource] by closing the
  /// [StreamController].
  void dispose() {
    _controller?.close();
    _controller = null;
    _stream = null;
  }
}
```

The `NetworkBoundResource` class is the heart of the NBR implementation. It's an abstract class that represents a resource bound to a network request. The `fetch` method is where the actual data fetching logic resides.

- `_controller` and `_stream` are used to create a stream of `Resource` objects representing the current state of the resource (`loading`, `success`, `failed`, or `empty`).
- `fetch` method fetches the resource from the network and emits `Resource` objects representing the current state of the resource. It takes several callbacks as arguments, which are used to fetch the resource from the API, load it from the database, store it to the database, determine if it should be fetched from the API, and map it from a DTO to an entity.

The `fetch` method first loads data from the database. Then, based on the `shouldFetch` callback, it decides whether to fetch data from the API or not. If it decides to fetch, it adds a `loading` resource to the stream, fetches the data, stores it in the database, and then adds a `success` resource to the stream. If an error occurs during this process, it adds a `failed` resource to the stream.

If it decides not to fetch, it adds a `success` resource to the stream if there's data, or an `empty` resource if there's no data.

The `_ensureControllerCreated` method ensures that the `StreamController` is created before it's used. The `dispose` method cleans up by closing the `StreamController`.

This code leverages Dart 3's new class modifier feature (which is something I [already wrote about](https://sunderee.github.io/sunderee-blog/posts/deep-dive-into-dart-3-class-modifiers.html)).

### RSS Service

```dart
enum AddSourceResult { success, failed }

abstract interface class IRssService {
  factory IRssService.instance(
    final IPreferencesService preferencesService,
    final Isar isarInstance,
  ) {
    return _RssService(preferencesService, isarInstance);
  }

  Stream<Resource<List<FeedObjectSchema>>> get sourceStream;

  void readSources();
  Future<AddSourceResult> addSource(final String url);
  Future<void> removeSource(final String url);
}

final class _RssService extends NetworkBoundResource<List<FeedObjectSchema>>
    implements IRssService {
  _RssService(this.preferencesService, this.isarInstance);

  static final HttpClient _client = HttpClient();
  static Future<String> _makeHTTPRequest(final String url) async {
    final request = await _client.getUrl(Uri.parse(url));
    final response = await request.close();
    return response.transform<String>(utf8.decoder).join();
  }

  final IPreferencesService preferencesService;
  final Isar isarInstance;

  @override
  Stream<Resource<List<FeedObjectSchema>>> get sourceStream => stream;

  @override
  void readSources() async {
    fetch<List<FeedObject>>(
      fetchFromAPI: () => preferencesService.sources().let(
            (final it) => Future.wait(
              it.map((final item) => _parseFeedObject(item)),
            ),
          ),
      loadFromDB: () async =>
          isarInstance.collection<FeedObjectSchema>().where().findAll(),
      storeToDB: (final List<FeedObjectSchema> schemas) async {
        final collection = isarInstance.collection<FeedObjectSchema>();
        isarInstance.writeTxn(() async {
          await collection.clear();
          await collection.putAll(schemas);
        });
      },
      shouldFetch: (final List<FeedObjectSchema>? schemas) async {
        if (schemas == null || schemas.isEmpty == true) {
          return true;
        }

        return switch (await (Connectivity().checkConnectivity())) {
          ConnectivityResult.mobile ||
          ConnectivityResult.wifi ||
          ConnectivityResult.vpn =>
            true,
          _ => false
        };
      },
      mapDTOToEntity: (final List<FeedObject> dtoList) => dtoList
          .map((final item) => FeedObjectSchema()
            ..title = item.title
            ..url = item.url
            ..sourceURL = item.sourceURL
            ..description = item.description
            ..items = item.items
                .map((final innerItem) => FeedObjectItemSchema()
                  ..title = innerItem.title
                  ..description = innerItem.description
                  ..published = innerItem.published
                  ..link = innerItem.link)
                .toList())
          .toList(),
    );
  }

  @override
  Future<AddSourceResult> addSource(final String url) async {
    try {
      final content = await compute<String, String>(_makeHTTPRequest, url);
      UniversalFeed.parseFromString(content);

      await preferencesService.addRssSource(url);
      return AddSourceResult.success;
    } catch (e) {
      return AddSourceResult.failed;
    }
  }

  @override
  Future<void> removeSource(final String url) async {
    await preferencesService.removeRssSource(url);
  }

  Future<FeedObject> _parseFeedObject(final String url) async {
    return Isolate.run(() async {
      final rawRssFeed = await _makeHTTPRequest(url);
      final rssFeed = UniversalFeed.parseFromString(rawRssFeed);
      return FeedObject(
        title: rssFeed.title ?? url,
        url: rssFeed.links.firstOrNull?.href ?? url,
        sourceURL: url,
        description: rssFeed.description,
        items: rssFeed.items
            .map((final item) => FeedObjectItem(
                  title: item.title ?? '',
                  description: item.description,
                  published: item.published?.value ?? item.updated?.value,
                  link: item.link?.href ??
                      item.links.firstOrNull?.href ??
                      item.guid ??
                      '',
                ))
            .toList(),
      );
    });
  }
}
```

This code represents a crucial part of my RSS reader application. It demonstrates fetching, storing, and displaying of RSS feed data. The code uses the Network-Bound Resource (NBR) pattern, leveraging the classes discussed previously, to handle these operations efficiently.

The `IRssService` interface defines the contract for the RSS service. It has a factory constructor that returns an instance of `_RssService`, which is a private implementation of `IRssService`. This interface exposes four methods:

- `readSources`: Reads the RSS feed sources.
- `addSource`: Adds a new RSS feed source.
- `removeSource`: Removes an existing RSS feed source.
- `sourceStream`: A getter that returns a stream of `Resource` objects representing the current state of the feed sources.

The `_RssService` class is a concrete implementation of the `IRssService` interface. It extends the `NetworkBoundResource` abstract class and provides the implementation of the methods defined in `IRssService`. The class uses a `HttpClient` to make HTTP requests, an `IPreferencesService` to interact with the user preferences, and an `Isar` instance to interact with the database.

The `readSources` method uses the `fetch` method from `NetworkBoundResource` to fetch the RSS feed sources, deciding whether to fetch from the network or use cached data based on certain conditions. It maps the data transfer object (DTO) to the entity, stores it to the database, and emits a stream of `Resource` objects representing the current state of the feed sources.

The `addSource` method adds a new RSS feed source. It first makes an HTTP request to fetch the RSS feed data, parses it, adds the source to the user preferences, and returns a success status. If an error occurs during this process, it returns a failed status.

The `removeSource` method removes an existing RSS feed source from the user preferences.

The `_parseFeedObject` method is a helper method that makes an HTTP request to fetch the RSS feed data, parses it, and returns a `FeedObject` representing the RSS feed.

This code demonstrates an efficient way to manage data fetching operations that should be coordinated between a local database and a remote API. It's a well-structured and robust solution to handle such operations in an RSS reader application, making the code easier to understand, test, and maintain.

## Summary

We've delved into the technical aspects of a simple yet sophisticated RSS reader app built with Flutter. The app is powered by Dart 3, with a focus on a robust architecture, efficient state management, and an offline-first approach, reflecting best practices in mobile app development.

The application uses the BLoC (Business Logic Component) pattern for state management, which separates the business logic from the UI, making the codebase easier to maintain and test. However, given the simplicity of the app, it avoids dependency injection libraries, favoring simplicity and direct instantiation.

One of the key features of the app is its custom implementation of the Network-Bound Resource (NBR) pattern, which is a powerful strategy to balance local and network data sources. This approach is particularly useful for applications that need to operate offline or under poor network conditions, as it allows the app to function seamlessly whether data is fetched from an API or loaded from a local database.

For data persistence, the application uses a combination of shared preferences and the Isar database. Shared preferences are used to store "sources" (a list of URLs to RSS feeds), while Isar powers the app's offline-first functionality.

The application is designed with internationalization in mind, using the `intl` library. While the app is currently only available in English, it is ready for translations, either manually or through the community.

Given the simplicity of the app, it might be tempting to overlook architectural best practices. However, the importance of a solid architectural foundation cannot be overstated. Following the principle "program with interfaces, not implementations," even in a simple app, provides flexibility for future enhancements and makes the code easier to maintain and test.

In addition, we examined and explained several sections of Dart code that power the core functionality of this app. The first section of code defines an abstract `NetworkBoundResource` class, which establishes the structure for handling data that can be in four states (`empty`, `loading`, `success`, or `failed`). This class, along with the `Resource` class, forms the backbone of the app's NBR implementation.

The second section of code introduced the `IRssService` interface and its concrete implementation `_RssService`. This part of the code manages the fetching, storing, and manipulation of RSS feeds. It exemplifies how the app interacts with both network (HTTP requests) and local (preferences and Isar database) data sources, effectively bringing the NBR concept to life.

Overall, this conversation has highlighted the importance of good architecture and best practices in the development of a simple yet powerful RSS reader app. The app's design and implementation underscore how Flutter and Dart can be used to create efficient, maintainable, and robust mobile applications, even when keeping the tech stack minimalistic and straightforward.
