///<reference path="../../src/interfaces/interfaces.d.ts" />

import { expect } from "chai";
import Binding from "../../src/bindings/binding";
import BindingType from "../../src/bindings/binding_type";
import BindingToSyntax from "../../src/syntax/binding_to_syntax";
import injectable from "../../src/annotation/injectable";
import * as ERROR_MSGS from "../../src/constants/error_msgs";

describe("BindingToSyntax", () => {

    it("Should set its own properties correctly", () => {

        interface INinja {}
        let ninjaIdentifier = "INinja";

        let binding = new Binding<INinja>(ninjaIdentifier);
        let bindingToSyntax = new BindingToSyntax<INinja>(binding);

        // cast to any to be able to access private props
        let _bindingToSyntax: any = bindingToSyntax;

        expect(_bindingToSyntax._binding.serviceIdentifier).eql(ninjaIdentifier);

    });

    it("Should be able to configure the type of a binding", () => {

        interface INinja {}

        @injectable()
        class Ninja implements INinja {}
        let ninjaIdentifier = "INinja";

        let binding = new Binding<INinja>(ninjaIdentifier);
        let bindingToSyntax = new BindingToSyntax<INinja>(binding);

        expect(binding.type).eql(BindingType.Invalid);

        bindingToSyntax.to(Ninja);
        expect(binding.type).eql(BindingType.Instance);
        expect(binding.implementationType).not.to.eql(null);

        bindingToSyntax.toConstantValue(new Ninja());
        expect(binding.type).eql(BindingType.ConstantValue);
        expect(binding.cache instanceof Ninja).eql(true);

        bindingToSyntax.toDynamicValue(() => { return new Ninja(); });
        expect(binding.type).eql(BindingType.DynamicValue);
        expect(typeof binding.dynamicValue).eql("function");
        expect(binding.dynamicValue() instanceof Ninja).eql(true);

        bindingToSyntax.toConstructor<INinja>(Ninja);
        expect(binding.type).eql(BindingType.Constructor);
        expect(binding.implementationType).not.to.eql(null);

        bindingToSyntax.toFactory<INinja>((context) => {
            return () => {
                return new Ninja();
            };
        });

        expect(binding.type).eql(BindingType.Factory);
        expect(binding.factory).not.to.eql(null);

        let f = () => { return "test"; };
        bindingToSyntax.toFunction(f);
        expect(binding.type).eql(BindingType.Function);
        expect(binding.cache === f).eql(true);

        bindingToSyntax.toAutoFactory<INinja>(ninjaIdentifier);

        expect(binding.type).eql(BindingType.Factory);
        expect(binding.factory).not.to.eql(null);

        bindingToSyntax.toProvider<INinja>((context) => {
            return () => {
                return new Promise<INinja>((resolve) => {
                    resolve(new Ninja());
                });
            };
        });

        expect(binding.type).eql(BindingType.Provider);
        expect(binding.provider).not.to.eql(null);

    });

    it("Should prevent invalid function bindings", () => {

        interface INinja {}

        @injectable()
        class Ninja implements INinja {}
        let ninjaIdentifier = "INinja";

        let binding = new Binding<INinja>(ninjaIdentifier);
        let bindingToSyntax = new BindingToSyntax<INinja>(binding);

        let f = function () {
            bindingToSyntax.toFunction(5);
        };

        expect(f).to.throw(ERROR_MSGS.INVALID_FUNCTION_BINDING);

    });

});
