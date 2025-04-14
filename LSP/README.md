# Liskov Substitution Principle (LSP)

> Subtypes must be substitutable for their base types without altering program correctness.

The Liskov Substitution Principle (LSP) ensures that derived classes can stand in for their parent classes without breaking system behavior. Violating LSP leads to fragile and unpredictable code.

### Key Benefits:
- Promotes true polymorphism
- Enables safe reuse of classes
- Enhances interface contracts and reliability

### Examples:
- Ensuring child classes honor the behaviors of their parent classes
- Avoiding unexpected side effects when subclass methods override base methods

The examples provided show both correct and incorrect implementations of LSP.
