define(['app/views/create_agreement/services/services_view', 'jquery', 'app/collections/tasks'],
    function(ServicesView, $, TaskCollection) {
        describe("Task Collection", function() {

            beforeEach(function() {
                jasmine.Ajax.install();
            });

            afterEach(function() {
                jasmine.Ajax.uninstall();
            });

            it("should create a new view", function() {
                var view = new ServicesView({
                    agreement: new Backbone.Model(),
                    tasks: new Backbone.Collection()
                });
                expect(view).toBeDefined();
            });

            it("should order models correctly", function() {
                var tasks = new TaskCollection({
                    "id": "123",
                    index: 1
                });
                tasks.add({
                    "id": "456",
                    index: 2
                });
                var view = new ServicesView({
                    agreement: new Backbone.Model(),
                    tasks: tasks
                });
                expect(tasks.at(0).get("index")).toEqual(1);

                view.updateModelsIndex();
                expect(tasks.at(0).get("index")).toEqual(0);
            });
        })
    });