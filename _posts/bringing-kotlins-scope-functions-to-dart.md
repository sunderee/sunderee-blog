---
title: "Bringing Kotlin's Scope Functions To Dart"
description: "Tiny gem that I simply can't live without and need dearly"
category: Dart
author: "Peter Aleksander Bizjak"
date: "2023-06-09 17:15"
---

In the world of programming, one cannot escape the beauty and artistry that the right tools and paradigms bring to the table. As programmers, we often find ourselves falling in love with certain features of the languages we use. When we switch to a different language, we sometimes miss those features and wonder why they aren't available. This is a story about one such feature from Kotlin, the versatile and elegant "scope functions," and an attempt to bring their magic into the world of Dart.

Kotlin, a statically typed programming language from JetBrains, offers a feature known as "scope functions." These are functions that allow you to execute a block of code within the context of an object. They're designed to make your code more concise, readable, and expressive by allowing you to structure your code in a way that minimizes unnecessary verbosity.

There are five scope functions in Kotlin: `let`, `run`, `with`, `apply`, and `also`. Each of these functions takes a receiver (an object to which the function is applied), and a block of code, which is executed in the context of the receiver. The main differences between these functions lie in the way they handle the receiver object and the value they return.

For instance, the `also` and `let` functions can be used to perform additional operations on an object, such as configuration or transformation, and then return the object itself (`also`) or the result of the transformation (`let`). On the other hand, `takeIf` and `takeUnless` help in writing expressive conditional statements by returning the object they were invoked on if it satisfies or does not satisfy a given predicament, respectively.

Dart, the language that powers Flutter, Google's UI toolkit for building natively compiled applications, was designed with different goals in mind compared to Kotlin. Dart aims for simplicity, familiarity, and ease of use, especially for JavaScript developers. It prioritizes fast, ahead-of-time (AOT) compilation to efficient machine code, which makes it a great fit for mobile and web applications.

While Dart does offer many modern language features, it doesn't include Kotlin's scope functions out of the box. This isn't necessarily due to an oversight or lack of capability, but rather a matter of design philosophy. Dart's creators opted for a more streamlined syntax and a smaller set of core language features to lower the learning curve and improve accessibility for new developers.

Comparing Kotlin and Dart is akin to comparing apples and oranges. While both are modern, powerful programming languages, they serve different ecosystems and are optimized for different use cases. Kotlin, with its expressive syntax and rich feature set, is a favorite among Android developers and is also gaining popularity in backend development. On the other hand, Dart's simplicity, combined with the power of Flutter, makes it a strong contender in the world of cross-platform app development.

Therefore, it isn't entirely fair to directly compare these two languages. Each has its strengths and weaknesses and is suited to particular scenarios. However, that doesn't mean we can't borrow ideas from one language to enhance our experience with another.

## Dart Scope Functions

Enter the [`dart_scope_functions`](https://pub.dev/packages/dart_scope_functions) library. As a long-time Kotlin developer who's switched to Dart, I've missed the conciseness and expressiveness that Kotlin's scope functions provide. This library brings these beloved Kotlin features to Dart, allowing you to enjoy the benefits of scope functions in your Dart code.

With `dart_scope_functions`, you can write more expressive and less verbose code. You can perform additional operations on an object and return either the object itself (`also`) or the result of an operation (`let`). Similarly, you can use `takeIf` and `takeUnless` to make your conditional statements more readable. Furthermore, you can use `run` to execute a block of code without the context of an object. In short, this library is intended to make your Dart code more expressive, more concise, and more fun to write, just like in Kotlin.

### Mini Documentation

Let's delve into each of the scope functions I've created.

#### `also`

The `also` function is used to perform additional operations on an object within a block of code. Here's how it's defined:

```dart
T also(void Function(T it) block) {
  block.call(this);
  return this;
}
```

`also` takes a function `block` as a parameter, which performs operations on the object it's called on (accessible within the block as `it`). After executing the `block`, `also` returns the original object (`this`). This function is beneficial for chaining operations on an object without modifying the object itself.

For example, you might want to log some information about an object before proceeding with other operations:

```dart
var user = User().also((it) => print('Created user with id: ${it.id}'));
```

In this case, `also` allows you to log the user's id without interrupting the chain of operations.

#### `let`

The `let` function transforms an object into another:

```dart
R let<R>(R Function(T it) block) {
  return block.call(this);
}
```

`let` also takes a function `block` as a parameter. However, unlike `also`, `let` transforms `this` into a new object and then returns that new object. This can be useful when you need to transform an object into another as part of a chain of operations:

```dart
var userId = User().let((it) => it.id);
```

Here, `let` transforms a `User` object into a `userId`, which can then be used in subsequent operations.

#### `takeIf`

The `takeIf` function returns an object if it satisfies a certain condition:

```dart
T? takeIf(bool Function(T it) predicament) {
  return predicament.call(this) ? this : null;
}
```

`takeIf` takes a function `predicament` as a parameter, which should return a boolean value. If the `predicament` returns `true` for the object `takeIf` is called on, `takeIf` returns the object. Otherwise, it returns `null`. This can be useful for conditional filtering of objects:

```dart
var activeUser = user.takeIf((it) => it.isActive);
```

In this example, `takeIf` returns the `user` if the user is active. Otherwise, it returns `null`.

#### `takeUnless`

The `takeUnless` function is the opposite of `takeIf`:

```dart
T? takeUnless(bool Function(T it) predicament) {
  return predicament.call(this) ? null : this;
}
```

`takeUnless` also takes a function `predicament` as a parameter. If the `predicament` returns `false` for the object `takeUnless` is called on, `takeUnless` returns the object. Otherwise, it returns `null`. This is useful when you want to exclude certain objects based on a condition:

```dart
var inactiveUser = user.takeUnless((it) => it.isActive);
```

In this case, `takeUnless` returns the `user` if the user is inactive (i.e., not active).

#### `run`

Finally, the `run` function is used to execute a block of code:

```dart
R run<R>(R Function() block) => block.call();
```

`run` takes a function `block` as a parameter and simply executes it. This function doesn't operate on an object like the others. Instead, it's a standalone function that's used to execute a block of code that doesn't require an object context.

## Limitations

Dart, like many other languages, has limitations that stem from its design and syntax, one of which is the absence of a direct replacement for Kotlin's `this` scope functions such as `apply` and `with`. The reasons behind these limitations lie in Dart's language design and its type system.

In Kotlin, `apply` and `with` are used to refer to the context object by `this` within the block of code. Here's an example in Kotlin:

```kotlin
val adam = Person("Adam").apply {
    age = 20
    city = "London"
}
```

In this example, `apply` lets you refer to the `Person` object as `this` within its block, allowing you to directly access and modify its properties.

However, in Dart, you cannot modify the `this` context within a function or an extension method. In Dart, `this` always refers to the current instance of the class where `this` is used. Unlike Kotlin, Dart doesn't have a language feature that allows changing the meaning of `this` within a particular scope.

This is primarily because Dart, unlike Kotlin, doesn't have a feature for "[function literals with receiver](https://kotlinlang.org/docs/lambdas.html#function-literals-with-receiver)", which are essentially functions that can be called on a receiver object. The `apply` and `with` functions in Kotlin are examples of such function literals with receiver.

In Dart, you could use cascades (`..`) as a workaround for this limitation. Cascades allow you to perform a series of operations on a single object. However, cascades don't work exactly the same way as `apply` or `with` in Kotlin. Here's the equivalent of the above Kotlin code in Dart using cascades:

```dart
var adam = Person("Adam")
  ..age = 20
  ..city = "London";
```

In this example, you can see that the Dart cascade `..` allows you to perform a series of operations on the `Person` object, similar to the `apply` function in Kotlin.

In conclusion, due to the design of Dart's type system and language features, you cannot implement a direct equivalent of Kotlin's `apply` or `with` functions that change the meaning of `this`. However, Dart provides other language features, such as cascades, which can be used to achieve similar functionality.

## Final Gem

If you don't want to add yet another dependency into your Dart/Flutter project, you can simply copy-paste the entire source code of the library I've created!

```dart
/// Extensions that can be used on any type [T].
extension ScopeFunctionExt<T> on T {
  /// Calls the specified function [block] with this value as its argument and
  /// returns `this` value.
  T also(void Function(T it) block) {
    block.call(this);
    return this;
  }

  /// Calls the specified function [block] with `this` value as its argument and
  /// returns its result.
  R let<R>(R Function(T it) block) {
    return block.call(this);
  }

  /// Returns `this` value if it satisfies the given [predicament] or null if
  /// it doesn't.
  T? takeIf(bool Function(T it) predicament) {
    return predicament.call(this) ? this : null;
  }

  /// Returns `this` value if it does not satisfy the given [predicament] or
  /// null if it does.
  T? takeUnless(bool Function(T it) predicament) {
    return predicament.call(this) ? null : this;
  }
}

/// Calls the specified function [block] and returns its result.
R run<R>(R Function() block) => block.call();
```

And thank you, for coming to the Dart side!
