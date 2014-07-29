define(['app/collections/tasks', 'jquery'], function(TaskCollection, $) {
    describe("Task Collection", function() {

        beforeEach(function() {
            jasmine.Ajax.install();
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it("should create a new collection", function() {
            var tasks = new TaskCollection();
            expect(tasks).toBeDefined();
        });

        it("should order models correctly", function() {
            var tasks = new TaskCollection();
            tasks.add([{
                index: 1
            }, {
                index: 0
            }]);
            expect(tasks.at(0).get("index")).toEqual(0);
        });
    })
});