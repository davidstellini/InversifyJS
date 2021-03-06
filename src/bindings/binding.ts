///<reference path="../interfaces/interfaces.d.ts" />

// Binding
// -----------

// A type binding (or just a binding) is a mapping between a service type
// (an interface), and an implementation type to be used to satisfy such
// a service requirement.

import BindingScope from "./binding_scope";
import BindingType from "./binding_type";
import guid from "../utils/guid";

class Binding<T> implements IBinding<T> {

    public guid: string;
    public moduleId: string;

    // Determines wether the bindings has been already activated
    // The activation action takes place when an instance is resolved
    // If the scope is singleton it only happens once
    public activated: boolean;

    // A runtime identifier because at runtime we don't have interfaces
    public serviceIdentifier: (string|Symbol|INewable<T>);

    // The constructor of a class which must implement T
    public implementationType: INewable<T>;

    // Cache used to allow singleton scope and BindingType.ConstantValue bindings
    public cache: T;

    // Cache used to allow BindingType.DynamicValue bindings
    public dynamicValue: () => T;

    // The scope mode to be used
    public scope: BindingScope;

    // The kind of binding
    public type: BindingType;

    // A factory method used in BindingType.Factory bindings
    public factory: IFactoryCreator<T>;

    // An async factory method used in BindingType.Provider bindings
    public provider: IProviderCreator<T>;

    // A constraint used to limit the contexts in which this binding is applicable
    public constraint: (request: IRequest) => boolean;

    // On activation handler (invoked just before an instance is added to cache and injected)
    public onActivation: (context: IContext, injectable: T) => T;

    constructor(serviceIdentifier: (string|Symbol|INewable<T>)) {
        this.guid = guid();
        this.activated = false;
        this.serviceIdentifier = serviceIdentifier;
        this.scope = BindingScope.Transient;
        this.type = BindingType.Invalid;
        this.constraint = (request: IRequest) => { return true; };
        this.implementationType = null;
        this.cache = null;
        this.factory = null;
        this.provider = null;
        this.onActivation = null;
    }

    public clone(): IBinding<T> {
        let clone = new Binding(this.serviceIdentifier);
        clone.activated = false;
        clone.implementationType = this.implementationType;
        clone.dynamicValue = this.dynamicValue;
        clone.scope = this.scope;
        clone.type = this.type;
        clone.factory = this.factory;
        clone.provider = this.provider;
        clone.constraint = this.constraint;
        clone.onActivation = this.onActivation;
        clone.cache = this.cache;
        return clone;
    }

}

export default Binding;
