---
title: "Deep dive into Dart 3: Class Modifiers"
description: "Let's talk about class modifiers in a way that explains them much better than copy-pasting official documentation"
category: Dart
author: "Peter Aleksander Bizjak"
date: "2023-05-19 07:17"
---

## Deep dive into Dart 3: Class Modifiers

Welcome to the world of Dart 3, where a rich set of new features and modifiers breathes fresh life into class declarations and opens up a myriad of possibilities for developers. If you're intrigued by the evolution of Dart and want to stay ahead of the curve, you're in the right place.

In this deep dive, we'll dissect the nuances of Dart 3's class modifiers, explore their distinct characteristics, understand their use cases, and unveil how they revolutionize the way you write and structure your Dart code. Whether you're a seasoned Dart developer or you're just getting started with the language, this exploration will provide you with valuable insights and inspiration for your programming journey.

We will also draw comparisons with other popular languages like Kotlin, Java, and C#. So if you're transitioning from these languages or working in a polyglot environment, you'll find the comparisons particularly helpful to understand Dart's evolution in a broader programming landscape.

Dart 3 brings us closer to a world where code can be safer, more predictable, and more flexible, as well as bring us one step closer to sending a signal to incoming JavaScript developers that they should maybe learn the basics of OOP. Yes, that was a joke. Don't @ me on Twitter.

Ready to dive in? Let's start our exploration by understanding each class modifier in detail...

### What's going on?

As mentioned in the intro, with the introduction of new class modifiers, Dart moved closer to languages like Kotlin, Java, and C#, especially with regards to its object-oriented features.

The following is basically a copy-paste from the [official documentation](https://dart.dev/language/class-modifiers). I'm being explicitly clear about that, because unlike some other authors out there who copy things without saying anything, I'm trying to be transparent here. Here's a brief overview, copied from the official documentation:

1. No modifier: to allow unrestricted permission to construct or subtype from any library, use a `class` or `mixin` declaration without a modifier.
2. Abstract: to define a class that doesn’t require a full, concrete implementation of its entire interface.
3. Base: to enforce inheritance of a class or mixin’s implementation
4. Interface: to define an interface.
5. Abstract interface: The most common use for the interface modifier is to define a pure interface. Combine the interface and abstract modifiers for an abstract interface class.
6. Final: To close the type hierarchy
7. Sealed: To create a known, enumerable set of subtypes

These modifiers can be combined:

1. (Optional) `abstract`, describing whether the class can contain abstract members and prevents instantiation.
2. (Optional) One of `base`, `interface`, `final` or `sealed`, describing restrictions on other libraries subtyping the class.
3. (Optional) `mixin`, describing whether the declaration can be mixed in.
4. The `class` keyword itself.

You can’t combine some modifiers because they are contradictory, redundant, or otherwise mutually exclusive:

- `abstract` with `sealed`. A sealed class is always implicitly abstract.
- `interface`, `final` or `sealed` with `mixin`. These access modifiers prevent mixin in.

With the copy-pasta out of the way, the next few sections will basically be divided into individual topics where I'll be answering questions that I personally had and sought answers for.

### Final classes

**Question 1: Would marking classes "final" by default be beneficial in Dart as well?**

The choice of whether to make classes "final" by default largely depends on the design philosophy of the language and the types of programming paradigms it seeks to support.

In Dart, given its flexibility and use in a variety of domains (like web, mobile, and potentially server-side), making classes "final" by default could potentially limit the flexibility and expressive power of the language. The power of Dart, particularly in the context of Flutter development, often comes from its use of inheritance and polymorphism. Therefore, while making classes "final" by default might increase safety in some ways, it might also be an unnecessary restriction in many common use-cases in Dart.

**Question 2: What are some best practices concerning the use of "final" in general? Can it interfere when writing tests? Can it enforce better code style?**

The "final" modifier can indeed enforce better code style. Here are some best practices and considerations:

1. Immutability: "final" classes are essentially immutable in terms of their inheritance hierarchy. This is beneficial when you want to ensure that the behavior of a class remains consistent and cannot be altered through inheritance.
2. Composition over inheritance: Marking a class as "final" encourages the use of composition over inheritance, which is generally considered a good practice in OOP.
3. Testing: Making classes "final" can complicate unit testing. If a class is "final", it cannot be mocked or stubbed, which can make it difficult to isolate dependencies during testing.
4. Flexibility: Be cautious about overusing "final". While it can enhance the integrity of your code, it also reduces flexibility. If there's a chance that a class might need to be extended in the future, it's better to leave it non-final.

**Question 3: Java, in comparison to Kotlin, does not define classes final by default. Should Dart developers use the Kotlin approach, if it's safer, or does it matter at all, and just use no modifier (like in Java) and only use "final" when absolutely needed?**

It's worth noting that the default behavior of a language often guides, but does not dictate, how one should use the language. Whether to use the "final" modifier should primarily be driven by the needs of the specific application rather than what's considered the default in other languages.

Both the Kotlin approach (making classes "final" by default) and the Java approach (leaving classes open for extension by default) have their merits. The Kotlin approach promotes a more cautious development style where developers need to consciously decide when to allow inheritance. On the other hand, the Java approach provides more flexibility for subclassing.

Dart developers should make decisions on a case-by-case basis, depending on their specific needs. For example, if a class is designed to be extended, or is part of a public API designed for other developers to build upon, then it might be better to leave it open. If, however, a class is meant to provide a specific, well-contained functionality that should not be tampered with through inheritance, then marking it as "final" can be a good way to enforce this.

### Abstract, Interface & Abstract Interface

**Question 1: In OOP, we often hear you should "program with interfaces, not implementations". What does that mean, is it a good practice, and how can that be achieved now with Dart's new modifiers?**

"Program to an interface, not an implementation" is a principle tied to the idea of abstraction. The idea is to depend on abstractions, not on concrete classes. This approach has several benefits including making your code more flexible, promoting code reuse, and making it easier to introduce new implementations without disturbing existing code.

For instance, if you're designing a function that takes a list of items and processes them in some way, by typing the parameter as a List interface (or an abstract class that represents a list-like object), you're allowing any object that fulfills the List interface to be used with the function, not just a specific implementation of List.

With the new Dart 3 modifiers, you can use the interface modifier to define an interface that can then be implemented by any class. An abstract interface can be used to define interfaces that also contain method signatures without implementation. This aligns with the principle of programming to an interface.

**Question 2: What would be the best use cases for either `abstract`, `interface` or `abstract interface`?**

**Abstract**: Use abstract classes when you want to create a base class that includes implementation details but cannot be instantiated itself. Abstract classes are excellent for defining a common set of behaviors and fields that can be shared among several closely related classes.

**Interface**: Use the interface modifier when you want to create a contract that other classes can choose to fulfill. The interface can be used as a data type and any class implementing the interface can be assigned to that data type. This is beneficial when different classes share the same behavior, but don't necessarily share an "is-a" relationship.

**Abstract interface**: Use abstract interface when you want to define an interface that includes unimplemented methods. This is used to define a contract that can be fulfilled by multiple classes without dictating any kind of inheritance hierarchy. It's useful when you need a set of classes to all follow the same contract, but they aren't necessarily related by inheritance.

**Question 3: What lessons can we learn from programming languages such as Java, Kotlin or C# in terms of using similar capabilities, that Dart developers should probably incorporate in their codebase?**

Here are a few lessons from Java, Kotlin and C# that might be useful for Dart developers:

1. Use interfaces to define type requirements: Java's interface feature, Kotlin's interface and delegation model, and C#'s interface feature all enforce the practice of programming to an interface, not an implementation. This can make the code more modular, easy to test, and flexible to changes.
2. Leverage abstract classes for shared behavior: Abstract classes in Java, Kotlin, and C# provide a way to define and share behavior among subclasses. They enforce a certain level of hierarchy and can be used to create robust, predictable class structures.
3. Use final/sealed classes for safety: Final classes in Java and Kotlin, and sealed classes in C#, provide a mechanism to prevent further subclassing. This can be useful in ensuring the safety and integrity of your class hierarchy.
4. Favor composition over inheritance when possible: Languages like Kotlin and C# have features like data classes and structs respectively, that encourage developers to use composition over inheritance for extending functionality. While Dart's new modifiers primarily deal with inheritance, Dart developers can still learn from this principle and use composition where it makes sense.

Remember, the best practices in other languages aren't always applicable in a straightforward way to a different language. The specific semantics, idioms, and design principles of each language should guide how you use its features.

### Sealed Classes

**Question 1: What problems do sealed classes solve?**

Sealed classes are used to represent restricted class hierarchies, where a value can have one of the types from a limited set. They provide a way to enforce exhaustive checking when a value is checked against all the possible types it can be. The key problems they solve include:

1. Controlled Inheritance: By sealing a class, developers can control where and how it's subclassed. This provides a strong guarantee about the class hierarchy and behavior of the class.
2. Exhaustive Checking: Particularly in a when (Kotlin) or switch (Dart) expression, sealed classes help ensure all possible cases are handled. If a new type is added to the sealed class hierarchy, the compiler will give an error wherever the types are exhaustively checked, helping to avoid bugs.
3. Maintaining Class Invariants: Sealed classes can ensure that a certain set of invariants are maintained, because subclasses can't be arbitrarily created by other parts of the program.

**Question 2: Are there any drawbacks to using sealed classes, especially in terms of testing? If yes, what can be done?**

Like any feature, sealed classes come with potential drawbacks:

1. Limited Flexibility: The main limitation is that they restrict the ability to extend classes, potentially making the code less flexible.
2. Testing Challenges: Sealed classes can also make testing harder. If a sealed class is used as a dependency in a class under test, it can't be subclassed to create a mock or a stub. In such cases, you could use a testing technique that doesn't require subclassing, such as dependency injection with interfaces or function parameters.
3. Code Organization: All subclasses of a sealed class need to be in the same file (Kotlin) or part file (Dart). This could potentially lead to large files if the hierarchy is complex.

**Question 3: What can Dart developers learn from experiences with sealed classes in languages such as Kotlin or C#?**

Here are a few lessons Dart developers might take from Kotlin and C#:

1. Use Sealed Classes for Known Hierarchies: Use sealed classes when you have a fixed set of classes that inherit from a superclass. They are particularly useful for modelling domain states, error states, or events in a state management system.
2. Ensure Exhaustive Checking: Make use of the compiler checks for exhaustive handling of all subclasses of a sealed class. This can help catch bugs at compile time.
3. Avoid Overuse: While sealed classes can be powerful, avoid overusing them. Use sealed classes only when it's necessary to limit class hierarchies. Overuse could lead to inflexible design.
4. Testability: Keep in mind that testing code that depends on sealed classes can be challenging, so consider using other abstractions, such as interfaces or abstract classes, when sealed classes are not strictly necessary.

### Mixins - Forgotten Darlings

Mixins in Dart are a way of reusing a class's code in multiple class hierarchies. In many ways, they're similar to interfaces, but with actual implemented methods. Here are the key reasons why Dart introduced mixins and their purpose:

1. Code Reuse: Dart, like other languages such as Java and C#, doesn't support multiple class inheritance due to the complexity and confusion it can bring (like the infamous "Diamond Problem"). However, there are situations where it's beneficial to share behavior across multiple unrelated classes. Mixins allow you to define and share these behaviors in a clean and efficient way, without the need for multiple inheritance.
2. Modularity: Mixins encourage developers to think in a more modular and compositional manner. Instead of designing classes in large, monolithic hierarchies, you can instead build up complex behaviors from smaller, simpler pieces (mixins). This can result in cleaner, more understandable code.
3. Avoiding Boilerplate: Without mixins, sharing code across unrelated classes often means writing similar code in multiple places, which leads to boilerplate and potential points of failure if changes aren't synchronized. Mixins let you share code in a DRY (Don't Repeat Yourself) way.

Considering all the new class modifiers in Dart 3, mixins **still** play an important role in structuring Dart code:

1. Despite the introduction of class modifiers like abstract, interface, and sealed, mixins still have a unique role in allowing behaviors to be shared across classes without requiring a class hierarchy relationship.
2. The base modifier forces a class to include an implementation when subclassing. This is in contrast to a mixin, which provides implementation that can be included in any class that wishes to use it, whether it's related by hierarchy or not.
3. Mixins work well with final classes. A final class can't be subclassed, but it can include a mixin to gain additional behaviors.

So, in summary, mixins in Dart provide a flexible and powerful mechanism for code reuse, modularity, and reduction of boilerplate, and they continue to play a vital role in the language even with the addition of new class modifiers in Dart 3.

## Summary

Oof, that was a long one... Let's wrap it up:

1. Class Modifiers: Dart 3 introduces a range of class modifiers, including abstract, base, final, interface, sealed, and mixin, which offer finer control over classes' behaviors and interactions in the program. They each serve a distinct purpose:

   - abstract is used to define a class that may contain abstract (unimplemented) methods, and can't be instantiated directly.
   - base is used to enforce inheritance of a class or mixin’s implementation, preventing the class from being implemented in other ways outside its library.
   - final closes off the class from being extended or implemented outside of the current library, enhancing API stability.
   - interface allows the class to be implemented, but not extended, by libraries outside the interface’s own defining library.
   - sealed classes can't be extended or implemented outside its own library and the compiler is aware of all possible direct subclasses, allowing for exhaustive type checks.
   - mixin allows a class to inherit the behaviors of another class, without being a subclass of that class.

2. Comparison with Other Languages: Dart 3's class modifiers bring it closer to languages like Kotlin, C#, and Java in terms of features, although each language has its unique strengths and conventions. Kotlin's approach to final classes by default and C#'s sealed classes find parallels in Dart 3.
3. Final Modifier: Making classes final by default can increase the safety and predictability of the codebase, though it does restrict extensibility. The use of final should be guided by the project's requirements and best practices, such as open-closed principle of SOLID. However, overuse of final can lead to inflexible code and can pose challenges in testing.
4. Abstract, Interface, Abstract Interface Modifiers: "Program with interfaces, not implementations" is a recommended OOP principle that promotes programming flexibility and extensibility. Dart's new abstract, interface, and abstract interface modifiers enable developers to create robust and flexible APIs that can be used interchangeably. Each of these modifiers has their distinct use cases and should be employed based on the design requirements.
5. Sealed Classes: Sealed classes solve problems related to controlled inheritance, exhaustive checking, and maintenance of class invariants. However, sealed classes restrict flexibility and pose challenges in testing. Learning from Kotlin and C#, Dart developers should use sealed classes judiciously to model known hierarchies and ensure exhaustive checking.
6. Mixins: Mixins in Dart enable code reuse, encourage modularity, and avoid boilerplate code. They offer a unique way to share behavior across unrelated classes, complementing the new class modifiers introduced in Dart 3.

The class modifiers introduced in Dart 3 help developers control how their classes are used and extended. They provide a greater degree of safety, predictability, and flexibility, which enhances the language's ability to handle complex software development tasks.
