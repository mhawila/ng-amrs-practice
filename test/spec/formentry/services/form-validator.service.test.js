/* global inject */
/* global beforeEach */
/* global describe */
/* global expect */
/* global it */
/*jshint -W026, -W030, -W106 */
(function () {
  'use strict';
  describe('Form Validator Service: Formentry Validation Service Helper Functions Unit Tests', function () {
    beforeEach(function () {
      module('app.formentry');

    });


    var service;
    var formlyModel;
    var validationExpression;
    var validationExpression2;
    var formIds;
    var currentLoadedFormService;

    beforeEach(inject(function ($injector) {
      service = $injector.get('FormValidator');
      currentLoadedFormService = $injector.get('CurrentLoadedFormService');
    }));

    beforeEach(function () {
      formlyModel = {
        section_5: {
          obs2_a8a003a6n1350n11dfna1f1n0026b9348838: {
            obs9_a898c56en1350n11dfna1f1n0026b9348838: 'a899b35c-1350-11df-a1f1-0026b9348838'
          },
          obs3_a8a003a6n1350n11dfna1f1n0026b9348838: [
            {
              obs10_a8a07a48n1350n11dfna1f1n0026b9348838: 'ab2723e2-e937-4f4c-8643-ef4a0c9ffa34'
            },
            {
              obs10_a8a07a48n1350n11dfna1f1n0026b9348838: '6d2bcec4-c1f1-4557-a75f-26b53e6448cc'
            }
          ]
        },
        section_1: {
          encounterProvider: 'fe6d47ce-816d-4c36-a8c8-05e593dd2341',
          encounterDate: '2015-09-08T21:00:00.000Z',
          encounterLocation: '',
          obs1_0f8b7f4en1656n46b7nbc93nd1fe4f193f5d: {}
        },
        section_2: {
          obs3_a89ff9a6n1350n11dfna1f1n0026b9348838: '1234565',
          obs4_dc1942b2n5e50n4adcn949dnad6c905f054e: '2015-09-08T21:00:00.000Z'
        },
        section_9: {
          obs9_bc3834ddnef07n4027nbe30n729baa069291: {},
          obs10_275eee16nc358n4f3anac16ne8f24659df87: {},
          obs11_3a69cfcfnf129n4702na8ddnd061d2a16b9d: {},
          obs12_2a4b87ddn977dn4ce8na321n1f13df4a31b2: {}
        }

      };

      validationExpression = '(q1 === null) || (q3 in ["val1", "val2", "val3"])';

      validationExpression2 = '(q1 === null) || ([12, "stringVal", "val3"].indexOf(q3) !== -1)';


      formIds = { q1: 12, q2: new Date(), q3: 'stringVal' };

    });


    it('should have form validator services are defined', function () {
      expect(service).to.exist;
      expect(service.evaluateExpression).to.exist;
    });

    it('should extract question ids when extractQuestionIds is called with an expression and object containing kesys', function () {
      var keys = service.extractQuestionIds(validationExpression, formIds);

      expect(keys).to.include.members(['q1', 'q3']);
    });

    it('should replace question placeholders with value when extractQuestionIds is invoked', function () {
      var replaced = service.replaceQuestionsPlaceholdersWithValue(validationExpression, formIds);
      expect(replaced).to.equal('(12 === null) || ("stringVal" in ["val1", "val2", "val3"])');
      
      //example2
      replaced = service.replaceQuestionsPlaceholdersWithValue(validationExpression2, formIds);
      expect(replaced).to.equal('(12 === null) || ([12, "stringVal", "val3"].indexOf("stringVal") !== -1)');
    });

    it('should evaluate an expression when evaluateExpression is inviked', function () {
      var toEvaluate = service.replaceQuestionsPlaceholdersWithValue(validationExpression2, formIds);
      var result = service.evaluateExpression(toEvaluate);

      expect(result).to.equal(true);
    });

    it('should invoke isEmpty function when evaluateExpression is invoked with an expression containing isEmpty', function () {
      var expression = '(isEmpty("val"))';
      var result = service.evaluateExpression(expression);
      expect(result).to.equal(false);

      expression = '(isEmpty(undefined))';
      result = service.evaluateExpression(expression);
      expect(result).to.equal(true);
    });

    it('should invoke arrayContains function when evaluateExpression is invoked with an expression containing arrayContains', function () {
      //non-array parameter
      var expression = '(arrayContains(["val", "val2", "val3"], "val"))';
      var result = service.evaluateExpression(expression);
      expect(result).to.equal(true);

      expression = '(arrayContains(["val", "val2", "val3"], "val4"))';
      result = service.evaluateExpression(expression);
      expect(result).to.equal(false);
      
      
      //array parameter
      expression = '(arrayContains(["val", "val2", "val3"], ["val","val3"]))';
      result = service.evaluateExpression(expression);
      expect(result).to.equal(true);

      expression = '(arrayContains(["val", "val2", "val3"], ["val","val4"]))';
      result = service.evaluateExpression(expression);
      expect(result).to.equal(false);
    });
  });

  describe('Form Validator Service: Generic Validation Logic Functions Unit Tests', function () {
    beforeEach(function () {
      module('app.formentry');

    });

    var service;
    var currentLoadedFormService;

    beforeEach(inject(function ($injector) {
      service = $injector.get('FormValidator');
      currentLoadedFormService = $injector.get('CurrentLoadedFormService');
      
    }));

    it('should have form validator services are defined', function () {
      expect(service).to.exist;
      expect(service.evaluateExpression).to.exist;
    });

    it('should return correct validation results when the validator object that getJsExpressionValidatorObject is invoked', function () {
      //sample one
      var params1 = {
        'type': 'js_expression',
        'failsWhenExpression': '!isEmpty(q7a) && arrayContains(["a89ff816-1350-11df-a1f1-0026b9348838","a89ff8de-1350-11df-a1f1-0026b9348838"], q7a) && isEmpty(myValue)',
        'message': 'Patient visit marked as unscheduled. Please provide the scheduled date.'
      };
      
      var currentModel = {
        key1: 'a89ff816-1350-11df-a1f1-0026b9348838',
        key2: ''
      };
      
      currentLoadedFormService.formValidationMetadata = {
        q7a:{
          key: 'key1'
        },
        q13a: {
          key: 'key2'
        }
      };
      
      currentLoadedFormService.formModel = currentModel;
      
      var validator =  service.getJsExpressionValidatorObject(params);
      
      var isValid = validator.expression(undefined, undefined, {});
      console.log(isValid);
      
      //failed case
      expect(isValid).to.equal(false);
      
      isValid = validator.expression(new Date().toISOString(), undefined, {});
      console.log(isValid);
      //passed case
      expect(isValid).to.equal(true);
      
      //sampe two
      
      
    });
    
    

  });
})();