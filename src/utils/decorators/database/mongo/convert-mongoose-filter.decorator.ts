export function ConvertMongoFilterToBaseRepository() {
  return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const input = args[0];

      input['deletedAt'] = null;

      if (input.id) {
        input['_id'] = input.id;
        delete input.id;
      }

      args[0] = input;
      const result = originalMethod.apply(this, args);
      return result;
    };
  };
}
